import express from "express"
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js"
const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/add", createProduct);
router.delete("/:id/delete", deleteProduct);
router.patch("/:id/update", updateProduct);

export default router;