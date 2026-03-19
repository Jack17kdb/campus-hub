import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

export const getAccessToken = async() => {
	const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

	const auth = Buffer.from(
			`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
		).toString("base64");

	try{
		const response = await axios.get(url, {
			headers: {
				Authorization: `Basic ${auth}`,
			},
		});

		console.log("Access Token: ", response.data.access_token);

		return response.data.access_token;
	} catch(error) {
		console.log("Error getting access token: ", error.response?.data || error.message);
		throw new Error("Failed to obtain M-Pesa access token");
	}
}
