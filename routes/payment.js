import express from "express";
import Order from "../models/order.js";
import { createSnapTransaction } from "../services/midtransService.js";

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

export default router;