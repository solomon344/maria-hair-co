"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Truck } from "lucide-react";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    ModemPayCheckout?: (config: any) => { close: () => void };
  }
}

interface DeliveryInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
}

const MODEMPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_MODEMPAY_PUBLIC_KEY || "";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const sharedToken = searchParams.get("shared");
  const { items, subtotal, clearCart, loadCart, setSharedCart } = useCart();
  const [step, setStep] = useState<"info" | "shipping" | "payment">("info");
  const [loadingShared, setLoadingShared] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });
  const hasLoadedShared = useRef(false);

  // Load the ModemPay inline checkout script once on the client.
  useEffect(() => {
    if (window.ModemPayCheckout) return;
    const script = document.createElement("script");
    script.src = "https://api.modempay.com/js/v1.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Load shared cart if token present and cart is empty
  useEffect(() => {
    const loadShared = async () => {
      if (!sharedToken || items.length > 0 || hasLoadedShared.current) return;
      hasLoadedShared.current = true;
      setLoadingShared(true);
      setSharedCart(true);
      try {
        const res = await fetch(`/api/cart/share/${sharedToken}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.items) {
          loadCart(data.items);
        }
      } catch {
        // ignore
      } finally {
        setLoadingShared(false);
      }
    };
    loadShared();
  }, [sharedToken, items.length]);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setPaymentError(null);
    try {
      // 1) Create a PENDING order on the server (no hosted intent — inline flow).
      const orderRes = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customerInfo: deliveryInfo,
          userId: session?.user?.id,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        setPaymentError(orderData.error || "Failed to start payment");
        return;
      }

      // 2) Open the ModemPay inline (drop-in) modal — charges on-page.
      if (!window.ModemPayCheckout) {
        setPaymentError("Payment module is still loading. Please try again in a moment.");
        return;
      }

      window.ModemPayCheckout({
        amount: Math.round(total * 100),
        currency: "GMD",
        public_key: MODEMPAY_PUBLIC_KEY,
        payment_methods: "wallet,card,bank",
        title: "Maria Hair Co. Order",
        description: `Payment for ${items.length} item(s)`,
        customer_email: deliveryInfo.email || undefined,
        customer_name: deliveryInfo.name || undefined,
        customer_phone: deliveryInfo.phone || undefined,
        metadata: { orderId: orderData.orderId },
        callback: async (transaction: any) => {
          try {
            const confirmRes = await fetch("/api/payment/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                transactionId: transaction?.id || transaction?.payment_intent_id,
              }),
            });
            const confirmData = await confirmRes.json();
            if (confirmData.success) {
              clearCart();
              router.push(`/payment/return?intentId=${orderData.orderId}`);
            } else {
              setPaymentError("Payment was not completed. Please try again.");
            }
          } catch {
            setPaymentError("Failed to confirm payment. Please contact support.");
          } finally {
            setPlacingOrder(false);
          }
        },
        onClose: (cancelled: boolean) => {
          if (cancelled) setPlacingOrder(false);
        },
      });
    } catch (error) {
      setPaymentError("An error occurred. Please try again.");
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
        {/* Breadcrumb + Back */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-1.5 text-[#6a5a4a] hover:text-[#533a00] transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <span className="text-[#e8dfd3]">/</span>
          <span className="text-[#533a00] font-body text-sm font-semibold">Checkout</span>
        </div>

        {loadingShared && (
          <div className="mb-6 p-3 text-sm bg-[#faf7f2] border border-[#e8dfd3] text-[#533a00]">
            Loading shared cart...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ─── Left: Checkout Form ─── */}
          <div className="lg:col-span-3">
            {/* Step indicators */}
            <div className="flex items-center gap-0 mb-10 border-b border-[#e8dfd3] pb-4">
              {[
                { key: "info" as const, label: "Information" },
                { key: "shipping" as const, label: "Shipping" },
                { key: "payment" as const, label: "Payment" },
              ].map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <button
                    onClick={() => setStep(s.key)}
                    className={`font-body text-sm transition-colors ${
                      step === s.key
                        ? "text-[#533a00] font-semibold"
                        : "text-[#c4b5a0] hover:text-[#6a5a4a]"
                    }`}
                  >
                    {s.label}
                  </button>
                  {i < 2 && <span className="mx-3 text-[#e8dfd3]">/</span>}
                </div>
              ))}
            </div>

            {/* Step: Information */}
            {step === "info" && (
              <div className="space-y-6">
                <h2 className="font-header font-bold text-[#1a120b] text-xl">Contact Information</h2>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={deliveryInfo.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="name"
                      value={deliveryInfo.name.split(" ")[0] || ""}
                      onChange={(e) => {
                        const parts = deliveryInfo.name.split(" ");
                        const newName = parts.length > 1 
                          ? parts[0] + " " + e.target.value
                          : e.target.value + " " + parts[1];
                        setDeliveryInfo(prev => ({ ...prev, name: e.target.value + " " + (parts[1] || "") }));
                      }}
                      placeholder="First name"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={deliveryInfo.name.split(" ")[1] || ""}
                      onChange={(e) => {
                        const parts = deliveryInfo.name.split(" ");
                        setDeliveryInfo(prev => ({ ...prev, name: (parts[0] || "") + " " + e.target.value }));
                      }}
                      placeholder="Last name"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <button
                  onClick={() => setStep("shipping")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Step: Shipping */}
            {step === "shipping" && (
              <div className="space-y-6">
                <h2 className="font-header font-bold text-[#1a120b] text-xl">Shipping Address</h2>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Apartment / Suite (optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={deliveryInfo.apartment}
                    onChange={handleInputChange}
                    placeholder="Apt, unit, etc."
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryInfo.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">State</label>
                    <select 
                      name="state"
                      value={deliveryInfo.state}
                      onChange={handleInputChange}
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors bg-white appearance-none"
                    >
                      <option value="">Select state</option>
                      <option value="CA">CA</option>
                      <option value="NY">NY</option>
                      <option value="TX">TX</option>
                      <option value="FL">FL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={deliveryInfo.zip}
                      onChange={handleInputChange}
                      placeholder="ZIP"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep("info")}
                    className="px-6 py-3 border border-[#e8dfd3] text-[#6a5a4a] text-xs uppercase tracking-wider font-semibold hover:bg-[#faf7f2] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("payment")}
                    className="px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step: Payment - Shows delivery info summary with Place Order button */}
            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="font-header font-bold text-[#1a120b] text-xl">Payment & Delivery</h2>
                
                {/* Delivery Information Summary */}
                <div className="bg-[#faf7f2] border border-[#e8dfd3] p-5">
                  <h3 className="font-header font-semibold text-[#1a120b] mb-4">Delivery Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-body text-sm text-[#6a5a4a] font-semibold">Name:</span>
                      <span className="font-body text-sm text-[#1a120b] ml-2">{deliveryInfo.name || "Not entered"}</span>
                    </div>
                    <div>
                      <span className="font-body text-sm text-[#6a5a4a] font-semibold">Email:</span>
                      <span className="font-body text-sm text-[#1a120b] ml-2">{deliveryInfo.email || "Not entered"}</span>
                    </div>
                    <div>
                      <span className="font-body text-sm text-[#6a5a4a] font-semibold">Phone:</span>
                      <span className="font-body text-sm text-[#1a120b] ml-2">{deliveryInfo.phone || "Not entered"}</span>
                    </div>
                    <div>
                      <span className="font-body text-sm text-[#6a5a4a] font-semibold">Address:</span>
                      <span className="font-body text-sm text-[#1a120b] ml-2">
                        {deliveryInfo.address ? `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zip}` : "Not entered"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inline payment — the ModemPay drop-in modal handles method
                    selection (wallet/card/bank) on-page via the button below. */}
                <div className="bg-[#faf7f2] border border-[#e8dfd3] p-5">
                  <h3 className="font-header font-semibold text-[#1a120b] mb-2">Pay with ModemPay</h3>
                  <p className="font-body text-sm text-[#6a5a4a]">
                    You'll complete payment securely in the ModemPay popup
                    (Wave, AfriMoney, card, or bank) without leaving this page.
                  </p>
                </div>

                {paymentError && (
                  <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-700">
                    {paymentError}
                  </div>
                )}

                {/* Order Totals */}
                {/* <div className="bg-[#faf7f2] border border-[#e8dfd3] p-5">
                  <h3 className="font-header font-semibold text-[#1a120b] mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 border-t border-[#e8dfd3] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-[#6a5a4a]">Subtotal</span>
                      <span className="font-body text-sm text-[#1a120b]">D{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-[#6a5a4a]">Shipping</span>
                      <span className="font-body text-sm text-[#1a120b]">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-semibold">FREE</span>
                        ) : (
                          `D${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-[#6a5a4a]">Tax (8%)</span>
                      <span className="font-body text-sm text-[#1a120b]">D{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[#e8dfd3] pt-3 flex items-center justify-between">
                      <span className="font-header font-bold text-[#1a120b]">Total</span>
                      <span className="font-header font-bold text-[#533a00] text-xl">D{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div> */}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-50"
                >
                  {placingOrder ? "Processing..." : `Place Order — D${total.toFixed(2)}`}
                </button>
              </div>
            )}
          </div>

          {/* ─── Right: Order Summary ─── */}
          <div className="lg:col-span-2">
            <div className="bg-[#faf7f2] border border-[#e8dfd3] p-6 md:p-8 sticky top-28">
              <h2 className="font-header font-bold text-[#1a120b] text-lg mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 shrink-0 bg-[#f5f0eb] overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-header font-bold text-[#1a120b] text-sm">{item.name}</h3>
                          <p className="text-[#8a7a6a] text-xs font-body">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-header font-bold text-[#533a00] text-sm shrink-0">
                          D{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-[#e8dfd3] pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-[#6a5a4a]">Subtotal</span>
                  <span className="font-body text-sm text-[#1a120b]">D{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-[#6a5a4a]">Shipping</span>
                  <span className="font-body text-sm text-[#1a120b]">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `D${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-[#6a5a4a]">Tax (8%)</span>
                  <span className="font-body text-sm text-[#1a120b]">D{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#e8dfd3] pt-3 flex items-center justify-between">
                  <span className="font-header font-bold text-[#1a120b]">Total</span>
                  <span className="font-header font-bold text-[#533a00] text-xl">D{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}