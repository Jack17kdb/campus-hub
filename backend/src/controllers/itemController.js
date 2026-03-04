import cloudinary from '../lib/cloudinary.js';
import Item from '../models/itemModel.js';

const createItem = async(req, res) => {
    try {
        const { title, description, image, intention, price, category, status } = req.body;

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newItem = new Item({
            title,
            description,
            image: imageUrl,
            intention,
            price: intention === "selling" ? price : 0,
            category,
            status: status || "Available",
            owner: req.user._id
        });

        await newItem.save();

        res.status(201).json(newItem);
    } catch (error) {
        console.log("Error creating item: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const getItems = async(req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const items = await Item.find(filter)
                    .populate('owner', 'username studentId')
                    .sort({ createdAt: -1 });

        res.status(200).json(items || []);
    } catch (error) {
        console.log("Error fetching items: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const getItemById = async(req, res) => {
    console.log("Fetching item with ID:", req.params.itemId);
    try {
        const { id } = req.params;
        const item = await Item.findById(id).populate('owner', 'username studentId');
        if (!item) return res.status(404).json({ message: "Item not found" });

        res.status(200).json(item);
    } catch (error) {
        console.log("Error fetching item: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const searchItems = async(req, res) => {
    try {
        const { query } = req.query;
        
        // Escape regex special characters to prevent injection
        const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const items = await Item.find({
            $or: [
                {title: { $regex: sanitizedQuery, $options: "i" }},
                {description: { $regex: sanitizedQuery, $options: "i" }}
            ]
        }).populate('owner', 'username studentId').sort({ createdAt: -1 });

        res.status(200).json(items || []);
    } catch (error) {
        console.log("Error searching items: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const updateItemStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if(item.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Unauthorized to update this item" });
        }

        item.status = status;
        await item.save();

        res.status(200).json({ "message": "Status updated successfully", item });
    } catch (error) {
        console.log("Error updating status: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const deleteItem = async(req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if(item.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Unauthorized to delete this item" });
        }

        await item.deleteOne();

        res.status(200).json({ "message": "Item deleted successfully" });
    } catch (error) {
        console.log("Error deleting item: ", error);
        res.status(500).json({ "message": error.message });
    }
};

export default { createItem, getItems, getItemById, searchItems, updateItemStatus, deleteItem };
