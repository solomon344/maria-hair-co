import "dotenv/config";
import ModemPay from "modem-pay";

const apiKey = process.env.MODEMPAY_SECRET_KEY || "";

export const modempay = new ModemPay(apiKey);

/**
 * Verify a payment using the ModemPay API (no webhooks involved).
 * Tries the payment intent first, then falls back to the transaction record.
 * Either identifier is returned from the inline `ModemPayCheckout` callback.
 */
export const verifyTransaction = async (reference: string) => {
  try {
    // Prefer verifying the payment intent directly via the API.
    try {
      const intent = await modempay.paymentIntents.retrieve(reference);
      return { source: "intent", data: intent };
    } catch {
      // Fall back to the transaction record if the reference is a transaction id.
      const transaction = await modempay.transactions.retrieve(reference);
      return { source: "transaction", data: transaction };
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};