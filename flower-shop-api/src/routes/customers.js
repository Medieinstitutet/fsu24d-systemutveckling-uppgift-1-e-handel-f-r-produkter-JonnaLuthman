import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/add", createCustomer);
router.delete("/:id/delete", deleteCustomer);
router.patch("/:id/update", updateCustomer);

export default router;
