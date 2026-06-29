"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Trash2, Shield, Truck, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<"info" | "shipping" | "payment">("info");

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
                    placeholder="your@email.com"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">First Name</label>
                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Phone</label>
                  <input
                    type="tel"
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
                    placeholder="Street address"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Apartment / Suite (optional)</label>
                  <input
                    type="text"
                    placeholder="Apt, unit, etc."
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">State</label>
                    <select className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors bg-white appearance-none">
                      <option>Select state</option>
                      <option>CA</option>
                      <option>NY</option>
                      <option>TX</option>
                      <option>FL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">ZIP Code</label>
                    <input
                      type="text"
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

            {/* Step: Payment */}
            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="font-header font-bold text-[#1a120b] text-xl">Payment</h2>
                <div className="flex items-center gap-3 p-4 bg-[#faf7f2] border border-[#e8dfd3]">
                  <CreditCard className="w-5 h-5 text-[#533a00]" />
                  <span className="text-sm font-body text-[#6a5a4a]">All transactions are secure and encrypted</span>
                  <Shield className="w-4 h-4 text-[#6a5a4a] ml-auto" />
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Expiration</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">CVC</label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep("shipping")}
                    className="px-6 py-3 border border-[#e8dfd3] text-[#6a5a4a] text-xs uppercase tracking-wider font-semibold hover:bg-[#faf7f2] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      clearCart();
                      router.push("/");
                    }}
                    className="px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
                  >
                    Place Order &mdash; ${total.toFixed(2)}
                  </button>
                </div>
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
                          ${(item.price * item.quantity).toFixed(2)}
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
                  <span className="font-body text-sm text-[#1a120b]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-[#6a5a4a]">Shipping</span>
                  <span className="font-body text-sm text-[#1a120b]">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-[#6a5a4a]">Tax (8%)</span>
                  <span className="font-body text-sm text-[#1a120b]">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#e8dfd3] pt-3 flex items-center justify-between">
                  <span className="font-header font-bold text-[#1a120b]">Total</span>
                  <span className="font-header font-bold text-[#533a00] text-xl">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-[#e8dfd3] space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#6a5a4a] font-body">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#6a5a4a] font-body">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#6a5a4a] font-body">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Visa, Mastercard, PayPal, Apple Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}