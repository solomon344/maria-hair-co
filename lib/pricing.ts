// Shared by the checkout page (display) and the order API (source of truth),
// so the total the customer sees is the same one the server charges.

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FEE = 5.99;
export const TAX_RATE = 0.08;

/** Prices are in Gambian dalasi, matching what ModemPay charges. */
export const formatPrice = (amount: number) => `D${amount.toFixed(2)}`;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateTotals(subtotal: number) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + shipping + tax);

  return { subtotal: round2(subtotal), shipping, tax, total };
}
