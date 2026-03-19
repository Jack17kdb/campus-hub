import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	receiverId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	itemId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Item",
		required: true
	},
	merchantRequestId: {
		type: String,
	},
	checkoutRequestID: {
		type: String,
	},
	phone: {
		type: String,
		trim: true
	},
	amount: {
		type: Number,
		required: true,
		min: 1
	},
	status: {
		type: String,
		enum: ['Success', 'Pending', 'Failed'],
		default: 'Pending',
		trim: true
	},
	receiptNumber: {
		type: String,
	},
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;