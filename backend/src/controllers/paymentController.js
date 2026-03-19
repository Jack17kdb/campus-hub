import Payment from '../models/paymentModel.js';

const getPayment = async(req, res) => {
	try{
		const { id } = req.params;

		const payment = await Payment.findById(id)
	      .populate("senderId", "username email")
	      .populate("receiverId", "username email")
	      .populate("itemId", "title image");

	    if (!payment) {
	      return res.status(404).json({ message: "Payment not found" });
	    }

		res.status(200).json(payment);
	} catch(error) {
		console.log("Error fetching payment: ", error);
		res.status(500).json({ message: "Error fetching payment" });
	}
};

const getPaymentsByType = async(req, res) => {
	try{
		const { type } = req.params;
		const userId = req.user._id;

		if(type === 'sent'){
			const sentPayments = await Payment.find({ senderId: userId })
	  			.sort({ createdAt: -1 })
	  			.populate("receiverId", "username email")
	  			.populate("itemId", "title image");

	  		return res.status(200).json(sentPayments);
		}

		if(type === 'received'){
			const receivedPayments = await Payment.find({ receiverId: userId })
	  			.sort({ createdAt: -1 })
	  			.populate("senderId", "username email")
	  			.populate("itemId", "title image");

	  		return res.status(200).json(receivedPayments);
		}

		res.status(404).json({ message: "No such type" });
	} catch(error) {
		console.log("Error fetching payments based on type: ", error);
		res.status(500).json({ message: "Error fetching payments based on type" });
	}
};

const filterPayments = async(req, res) => {
	try {
	    const { query } = req.query;

            if(!query || !query.trim()){
               return res.status(400).json({ message: "Search query is required" });
            }

            const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	    const userId = req.user._id;

	    const payments = await Payment.find({
	      $or: [
	        { senderId: userId },
	        { receiverId: userId },
	      ],
	      $and: [
	        {
	          $or: [
	            { phone: { $regex: sanitizedQuery, $options: "i" } },
	            { amount: parseFloat(sanitizedQuery) || -1 },
	            { status: { $regex: sanitizedQuery, $options: "i" } },
	          ],
	        },
	      ],
	    })
	      .sort({ createdAt: -1 })
	      .populate("senderId", "username email")
	      .populate("receiverId", "username email")
	      .populate("itemId", "title image");

	    res.status(200).json(payments);
	  } catch (error) {
	    console.log("Error filtering payments: ", error);
	    res.status(500).json({ message: "Error filtering payments" });
	  }
};

export default { getPayment, getPaymentsByType, filterPayments }
