import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// CREATE SNAP
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

// CHECK STATUS
export async function checkTransactionStatus(orderId) {
  return await coreApi.transaction.status(orderId);
}