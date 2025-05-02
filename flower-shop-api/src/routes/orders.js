import express from "express";
import {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrderById,
  updateOrder,
  createOrder_paypal,
  captureOrder_paypal
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/add", createOrder);
router.delete("/:id/delete", deleteOrder);
router.patch("/:id/update", updateOrder);
router.post("/add-paypalOrder", createOrder_paypal)
router.post("/:id/capture", captureOrder_paypal)

export default router;
