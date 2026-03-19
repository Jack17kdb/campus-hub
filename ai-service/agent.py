import os
import json
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain.tools import tool
from pymongo.errors import ConnectionFailure
from typing import Annotated, TypedDict, List, Optional
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Agentic MongoDB API")
MONGODB_URI = os.getenv("MONGODB_URI")

@tool('get_mongodb_schema', description="Connects to MongoDB and gets the schema by sampling documents")
def get_mongodb_schema(collection_name: str, db_name: Optional[str] = None, sample_size: int = 5):
	"""
		Infers the schema of a collection.
		'collection_name' is required. 'db_name' is optional as it's pulled from URI.
	"""

	try:
		client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
		db = client[db_name] if db_name else client.get_database()
		collection = db[collection_name]

		samples = collection.find().limit(sample_size)

		schema = {}

		for doc in samples:
			for key, value in doc.items():
				field_type = type(value).__name__
				if key not in schema:
					schema[key] = field_type

		return {
			"collection": collection_name,
			"schema": schema,
			"sample_count": sample_size
		}

	except Exception as e:
		return { "error": f"Failed to retrieve schema: {str(e)}" }

	finally:
		client.close()

@tool('list_mongodb_collections', description="Connects to MongoDB and returns a list of all available collections")
def list_mongodb_collections():
	try:
		client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)

		db = client.get_database()
		collections = db.list_collection_names()

		return {
			"database": db.name,
			"collections": collections,
			"count": len(collections)
		}

	except Exception as e:
		return { "error": f"Could not retrieve collections: {str(e)}" }

	finally:
		client.close()

@tool('query_mongodb', description="Executes a query on a specific collection and returns results")
def query_mongodb(collection_name: str, filter_query: Optional[dict] = None, projection: Optional[dict] = None, limit: int = 5):
	try:
		client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
		db = client.get_database()
		collection = db[collection_name]

		if isinstance(filter_query, str):
			filter_query = json.loads(filter_query)

		if filter_query:
			for key, value in filter_query.items():
				if isinstance(value, str):
					filter_query[key] = {"$regex": value, "$options": "i"}

		cursor = collection.find(filter_query or {}, projection).limit(limit)

		results = list(cursor)

		for res in results:
			if '_id' in res:
				res['_id'] = str(res['_id'])

		return {
			"collection": collection,
			"results": results,
			"count": len(results)
		}

	except Exception as e:
		return { "error": f"Query failed: {str(e)}" }

	finally:
		client.close()

gemini = ChatGoogleGenerativeAI(
	model="gemini-2.5-flash",
	temperature=0
)

gpt = ChatOpenAI(
	model="gpt-4o-mini",
	temperature=0
)

SYSTEM_PROMPT = """
You are an expert MongoDB Data Assistant. Your goal is to answer the question by querying the remote database.

FOLLOW THESE STEPS IN ORDER:
1. LIST: Call 'list_mongodb_collections' to see what data is available.
2. INSPECT: Once you identify the relevant collection, call 'get_mongodb_schema' to understand the field names and data types.
3. QUERY: Use 'query_mongodb' to fetch the actual data.

IMPORTANT RULES:
- Items collection contains items for sale or lost and found based on intention.
- Never return user passwords or anything sensitive.
- Never guess field names; always check the schema first.
- If a query fails, look at the error message, re-inspect the schema, and try a corrected query.
- Only return the final answer to the user once you have the data.
- Limit your queries to 5-10 results unless specifically asked for more.
"""

class AgentState(TypedDict):
	messages: Annotated[list, add_messages]

tools = [list_mongodb_collections, get_mongodb_schema, query_mongodb]
tool_node = ToolNode(tools)

llm_with_tools = gemini.bind_tools(tools)

def model_call(state: AgentState):
	messages = state["messages"]

	if not isinstance(messages[0], SystemMessage):
		messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages

	response = llm_with_tools.invoke(messages)
	return { "messages": [response] }

def should_continue(state: AgentState):
	last_message = state['messages'][-1]
	if last_message.tool_calls:
		return "tools"
	return END

workflow = StateGraph(AgentState)

workflow.add_node('agent', model_call)
workflow.add_node('tools', tool_node)

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

agent = workflow.compile()

class QueryRequest(BaseModel):
	user_input: str
	thread_id: Optional[str] = "user"

@app.post("/ask-database")
async def ask_database(request: QueryRequest):
	try:
		config = { 'configurable': { 'thread_id': request.thread_id } }

		initial_state = {
			"messages": [('user', request.user_input)]
		}

		final_state = agent.invoke(initial_state, config=config)

		raw_content = final_state["messages"][-1].content

		if isinstance(raw_content, list):
			final_answer = "".join([item.get("text", "") for item in raw_content if isinstance(item, dict)])
		else:
			final_answer = str(raw_content)

		return {
			"status": "success",
			"answer": final_answer
		}

	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
	import uvicorn
	uvicorn.run(app, host="0.0.0.0", port=8000)
