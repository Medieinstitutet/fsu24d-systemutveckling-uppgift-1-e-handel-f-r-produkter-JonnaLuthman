import express from "express"
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js"
const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id", updateProduct);

export default router;