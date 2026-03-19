import express from "express";
import cartController from "../controllers/cartController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.get("/", protect, cartController.getCartItems);
router.post("/:itemId", protect, cartController.addCartItem);
router.delete("/:id", protect, cartController.deleteCartItem);

export default router;
