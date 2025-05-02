import express from "express";
import {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrderById,
  updateOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/add", createOrder);
router.delete("/:id/delete", deleteOrder);
router.patch("/:id/update", updateOrder);

export default router;
