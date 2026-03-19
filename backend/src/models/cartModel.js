import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	itemId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Item",
		required: true
	},
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;