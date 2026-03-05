import midtransClient from "midtrans-client";
import Order from "../models/order.js";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});


// CREATE SNAP TRANSACTION

export async function createSnapTransaction(order) {
  const parameter = {
    transaction_details: {
      order_id: order._id.toString(),
      gross_amount: order.amount,
    },
    customer_details: {
      first_name: order.name,
      email: order.email,
    },
  };

  return await snap.createTransaction(parameter);
}


// CHECK TRANSACTION STATUS

export async function checkTransactionStatus(orderId) {
  return await coreApi.transaction.status(orderId);
}


// HANDLE MIDTRANS NOTIFICATION

export async function handleNotification(req, res) {
  try {
    const notification = req.body;

    const statusResponse =
      await coreApi.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log("Midtrans Notification:", statusResponse);

    let orderStatus = "pending";

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        orderStatus = "success";
      }
    } 
    else if (transactionStatus === "settlement") {
      orderStatus = "success";
    } 
    else if (transactionStatus === "pending") {
      orderStatus = "pending";
    } 
    else if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "expire"
    ) {
      orderStatus = "failed";
    }

    // update order di database
    await Order.findByIdAndUpdate(orderId, {
      status: orderStatus,
      paymentType: paymentType,
    });

    res.status(200).json({
      message: "Notification handled",
      orderId,
      status: orderStatus,
    });

  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({
      message: "Notification error",
    });
  }
}