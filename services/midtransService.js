import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

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