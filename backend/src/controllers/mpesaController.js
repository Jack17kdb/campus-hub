import axios from "axios";
import moment from "moment";
import Payment from "../models/paymentModel.js";
import { getAccessToken } from "../lib/mpesa.js";

export const stkPush = async (req, res) => {
  const formatPhone = (phone) => (phone.startsWith("0") ? "254" + phone.slice(1) : phone);

  const { receiverId, itemId, phone, amount } = req.body;
  const senderId = req.user._id;

  try {
    const formattedPhone = formatPhone(phone);

    const payment = await Payment.create({
      senderId,
      receiverId,
      itemId,
      amount,
      status: "Pending",
    });

    const token = await getAccessToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "KINAP HUB",
        TransactionDesc: "Payment from user",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    payment.checkoutRequestID = response.data.CheckoutRequestID;
    await payment.save();

    res.status(200).json({
      message: "STK Push initiated",
      checkoutRequestID: response.data.CheckoutRequestID,
      merchantRequestID: response.data.MerchantRequestID,
    });
  } catch (error) {
    console.error("STK ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "STK Push failed" });
  }
};

export const mpesaCallback = async (req, res) => {
  try {
    const data = req.body;
    console.log("💰 Callback received:", data);

    const result = data.Body?.stkCallback || {};
    const status = result.ResultCode === 0 ? "Success" : "Failed";
    const checkoutRequestID = result.CheckoutRequestID;

    const payment = await Payment.findOne({ checkoutRequestID });
    if (!payment) {
      console.error("Payment not found for CheckoutRequestID:", checkoutRequestID);
      return res.status(404).json({ error: "Payment not found" });
    }

    const callbackItems = result.CallbackMetadata?.Item || [];
    const phone = callbackItems.find((i) => i.Name === "PhoneNumber")?.Value;
    const amount = callbackItems.find((i) => i.Name === "Amount")?.Value;
    const receiptNumber = callbackItems.find((i) => i.Name === "MpesaReceiptNumber")?.Value;

    payment.status = status;
    payment.phone = phone;
    payment.amount = amount;
    payment.receiptNumber = receiptNumber;

    await payment.save();

    res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback Error:", error.message);
    res.status(500).json({ error: "Callback failed" });
  }
};
