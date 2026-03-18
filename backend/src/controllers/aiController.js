import axios from 'axios';

const agent = async(req, res) => {
	try {
		const { user_input } = req.body;
		const userId = req.user?._id;

		const data = {
			"user_input": user_input,
			"thread_id": userId
		}

		const response = await axios.post('http://localhost:8000/ask-database', data);

		res.status(200).json(response.data);
	} catch(error) {
		console.log("Error calling agent: ", error);
		res.status(500).json({ message: "Error calling agent" })
	}
}

export default { agent }
