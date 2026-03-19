import Cart from '../models/cartModel.js';

const getCartItems = async(req, res) => {
	try{
		const userId = req.user._id;

		const cartItems = await Cart.find({userId})
			.sort({ createdAt: -1 })
			.populate("userId", "username email")
	      	.populate("itemId", "title image price");

	    res.status(200).json(cartItems);
	} catch(error) {
		console.log("Error fetching cart items: ", error);
		res.status(500).json({ message: "Error fetching cart items" })
	}
};

const addCartItem = async(req, res) => {
	try{
		const { itemId } = req.params;
		const userId = req.user._id;

		const existingItem = await Cart.findOne({ userId, itemId });
	    if (existingItem) {
	      return res.status(400).json({ message: "Item already in cart" });
	    }

		const newItem = await Cart.create({
			userId,
			itemId
		});

		res.status(201).json({ message: "Item added to cart" });
	} catch(error) {
		console.log("Error adding item to cart: ", error);
		res.status(500).json({ message: "Error adding item to cart" });
	}
};

const deleteCartItem = async(req, res) => {
	try{
		const { id } = req.params;

		const cartItem = await Cart.findById(id);

		if (!cartItem) {
		    return res.status(404).json({ message: "Cart item not found" });
		}
		if (cartItem.userId.toString() !== req.user._id.toString()) {
		    return res.status(403).json({ message: "Unauthorized" });
		}
		
		await cartItem.deleteOne();

		res.status(200).json({ message: "Cart Item deleted successfully" });
	} catch(error) {
		console.log("Error deleting item from cart: ", error);
		res.status(500).json({ message: "Error deleting item from cart" })
	}
};

export default { getCartItems, addCartItem, deleteCartItem }