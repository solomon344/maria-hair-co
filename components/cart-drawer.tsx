"use client";

import { useCart } from "@/context/cart-context";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, itemCount, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8dfd3]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#533a00]" />
            <h2 className="font-header font-bold text-[#1a120b] text-lg">Cart ({itemCount})</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#6a5a4a] hover:text-[#1a120b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag className="w-12 h-12 text-[#e8dfd3] mb-4" />
            <p className="text-[#6a5a4a] font-body text-lg mb-1">Your cart is empty</p>
            <p className="text-[#8a7a6a] font-body text-sm mb-6">
              Looks like you haven&rsquo;t added anything yet.
            </p>
            <button
              onClick={() => { closeCart(); router.push("/shop"); }}
              className="px-6 py-3 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-5 border-b border-[#f0ebe5] last:border-b-0">
                  <div className="w-20 h-24 shrink-0 bg-[#f5f0eb] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-header font-bold text-[#1a120b] text-sm">{item.name}</h3>
                        <p className="text-[#8a7a6a] text-xs font-body mt-0.5">{item.tagline}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-[#c4b5a0] hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#e8dfd3]">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeItem(item.id);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="p-1.5 text-[#6a5a4a] hover:text-[#1a120b] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-body text-[#1a120b] min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-[#6a5a4a] hover:text-[#1a120b] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-header font-bold text-[#533a00] text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[#e8dfd3] px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-body text-[#6a5a4a] text-sm">Subtotal</span>
                <span className="font-header font-bold text-[#1a120b] text-lg">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[#8a7a6a] text-xs font-body">
                Shipping & taxes calculated at checkout
              </p>
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
              >
                Checkout &mdash; ${subtotal.toFixed(2)}
              </button>
              <button
                onClick={closeCart}
                className="w-full text-center text-[#6a5a4a] text-sm font-body hover:text-[#533a00] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}