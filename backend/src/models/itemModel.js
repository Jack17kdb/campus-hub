import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    intention: String,
    price: {
        type: Number,
        default: 0
    },
    category: String,
    status: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

export default Item;
