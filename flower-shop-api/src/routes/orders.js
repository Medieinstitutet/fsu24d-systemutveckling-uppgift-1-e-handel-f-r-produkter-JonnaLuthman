import express from "express";
import {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrderById,
  updateOrder,
  getOrderItemsByOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.get("/:id/items", getOrderItemsByOrder);
router.post("/", createOrder);
router.delete("/:id", deleteOrder);
router.patch("/:id", updateOrder);

export default router;
