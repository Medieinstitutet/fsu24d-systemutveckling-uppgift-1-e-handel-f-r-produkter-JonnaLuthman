import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
} from "../controllers/cartController.js"

const router = express.Router()

router.get("/:cartId", getCart)
router.post("/:cartId/add", addToCart)
router.patch("/:cartId/update", updateCartItem)
router.delete("/:cartId/remove", removeFromCart)

export default router;