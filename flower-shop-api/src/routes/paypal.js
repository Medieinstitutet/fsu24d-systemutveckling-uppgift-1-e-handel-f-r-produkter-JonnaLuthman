import { createOrder_paypal,captureOrder_paypal } from "../controllers/orderController.js"
import express from "express"

const router = express.Router();

router.post("/orders", async (req, res) => {
    try {
        const { cart, amount } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder_paypal(cart, amount);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

router.post("/:orderID/capture", async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await captureOrder_paypal(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
});

export default router;