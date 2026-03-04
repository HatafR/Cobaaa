import express from "express";
import Order from "../models/order.js";
import { createSnapTransaction } from "../services/midtransService.js";
import { checkTransactionStatus } from "../services/midtransService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, amount } = req.body;

    // 1️⃣ Simpan order dulu ke DB
    const order = await Order.create({
      name,
      email,
      amount,
    });

    // 2️⃣ Generate snap token
    const transaction = await createSnapTransaction(order);

    res.json({
      message: "Transaction created",
      snapToken: transaction.token,
      orderId: order._id,
      redirectUrl: transaction.redirect_url,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment error" });
  }
});

// CHECK STATUS
router.get("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const statusResponse = await checkTransactionStatus(orderId);

    // Update status ke DB
    await Order.findByIdAndUpdate(orderId, {
      status: statusResponse.transaction_status,
    });

    res.json({
      orderId,
      status: statusResponse.transaction_status,
      raw: statusResponse,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check status" });
  }
});

export default router;