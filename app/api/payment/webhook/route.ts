import { NextResponse } from "next/server";
import { modempay } from "@/lib/modempay";
import { markOrderPaid, type ModemPayRecord } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

/**
 * ModemPay webhook — backup path for marking orders PAID when the browser
 * never reaches /api/payment/confirm (tab closed, network drop, etc.).
 *
 * Configure in the ModemPay dashboard → Developers → Webhooks:
 *   URL:    https://<your-domain>/api/payment/webhook
 *   Secret: same value as MODEMPAY_WEBHOOK_SECRET
 *
 * The signature is an HMAC-SHA512 of the exact request body, so the raw text
 * must be verified before parsing — re-serialising parsed JSON can change the
 * bytes and make every signature check fail.
 */
export async function POST(request: Request) {
  const secret = process.env.MODEMPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("MODEMPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("x-modem-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature missing" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: { event: string; payload: ModemPayRecord };
  try {
    event = modempay.webhooks.composeEventDetails(rawBody, signature, secret) as any;
  } catch (error) {
    console.warn("Rejected ModemPay webhook:", (error as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const payload = event.payload;

    switch (event.event) {
      case "charge.succeeded": {
        const orderId = payload?.metadata?.orderId;
        if (typeof orderId !== "string") {
          console.warn(`charge.succeeded ${payload?.id} has no metadata.orderId`);
          break;
        }
        const outcome = await markOrderPaid(orderId, payload);
        if (!outcome.ok) {
          console.warn(`Webhook could not mark order ${orderId} paid: ${outcome.reason}`);
        }
        break;
      }

      case "charge.cancelled":
      case "charge.expired": {
        const orderId = payload?.metadata?.orderId;
        if (typeof orderId === "string") {
          await prisma.order.updateMany({
            where: { id: orderId, status: "PENDING_PAYMENT" },
            data: { status: "CANCELED" },
          });
        }
        break;
      }

      default:
        // Other events (customer.*, payment_intent.*, transfer.*) aren't used yet.
        break;
    }
  } catch (error) {
    // Still acknowledge: a 5xx would make ModemPay retry an event we've
    // already authenticated. The order can be recovered via /api/payment/verify.
    console.error(`Error handling ModemPay webhook ${event.event}:`, error);
  }

  return NextResponse.json({ received: true });
}
