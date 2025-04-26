import express from "express";
import { createOrderItem, deleteOrderItem, updateOrderItem } from "../controllers/orderItemController.js";

const router = express.Router();

router.post("/", createOrderItem);
router.delete("/:id", deleteOrderItem);
router.patch("/:id", updateOrderItem);

export default router;