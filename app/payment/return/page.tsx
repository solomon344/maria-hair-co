"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { prisma } from "@/lib/prisma";
import { useSession } from "next-auth/react";

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  

  useEffect(() => {
    const verifyPayment = async () => {
      const reference =
        searchParams.get("transaction_id") ||
        searchParams.get("reference") ||
        searchParams.get("intentId");

      if (!reference) {
        setStatus("failed");
        return;
      }

      try {
        const res = await fetch(`/api/payment/verify?transactionId=${reference}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setOrderDetails(data.order);
          clearCart();
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#533a00] mx-auto mb-4"></div>
          <p className="text-[#6a5a4a] font-body">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-header text-[#1a120b] mb-4">Payment Successful!</h1>
          <p className="text-[#6a5a4a] font-body mb-6">
            Thank you for your order. Your payment has been processed successfully.
          </p>
          {orderDetails && (
            <div className="bg-[#faf7f2] border border-[#e8dfd3] p-4 mb-6 text-left">
              <p className="font-body text-sm text-[#6a5a4a] mb-2">Order #{orderDetails.id}</p>
              <p className="font-body text-sm text-[#6a5a4a]">Total: ${orderDetails.total}</p>
            </div>
          )}
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-header text-[#1a120b] mb-4">Payment Failed</h1>
        <p className="text-[#6a5a4a] font-body mb-6">
          There was an issue verifying your payment. Please try again or contact support.
        </p>
        <button
          onClick={() => router.push("/checkout")}
          className="px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#533a00] mx-auto mb-4"></div>
          <p className="text-[#6a5a4a] font-body">Loading...</p>
        </div>
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  );
}