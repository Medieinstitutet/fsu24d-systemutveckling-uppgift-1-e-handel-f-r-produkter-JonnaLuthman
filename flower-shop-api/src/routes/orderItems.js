import express from "express";
import { createOrderItem, deleteOrderItem, updateOrderItem } from "../controllers/orderItemController.js";

const router = express.Router();

router.post("/", createOrderItem);
router.delete("/:id/delete", deleteOrderItem);
router.patch("/:id/update", updateOrderItem);

export default router;