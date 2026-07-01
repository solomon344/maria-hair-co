import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SharedCartPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const shared = await prisma.sharedCart.findUnique({
    where: { token },
  });

  if (!shared || shared.expiresAt < new Date()) {
    notFound();
  }

  const items = shared.items as any[];
  const total = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
  const ownerName = shared.userName;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-header text-[#1a120b] mb-3">
            {ownerName}'s Hair Care Wish List
          </h1>
          <p className="text-[#6a5a4a] font-body text-lg">
            {ownerName} has handpicked these products just for you — because you deserve a little luxury.
          </p>
        </div>

        <div className="bg-[#faf7f2] border border-[#e8dfd3] rounded-sm p-6 md:p-8">
          <div className="space-y-5 mb-8">
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-5">
                <div className="w-24 h-28 shrink-0 bg-[#f5f0eb] overflow-hidden">
                  <Image src={item.image} alt={item.name} width={96} height={112} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-header font-bold text-[#1a120b]">{item.name}</h3>
                      <p className="text-[#8a7a6a] text-xs font-body mt-0.5">{item.tagline}</p>
                      <p className="text-[#6a5a4a] text-sm font-body mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-header font-bold text-[#533a00]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e8dfd3] pt-5 flex items-center justify-between">
            <span className="font-header font-bold text-[#1a120b] text-lg">Total</span>
            <span className="font-header font-bold text-[#533a00] text-2xl">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#8a7a6a] font-body">Clicking below will start checkout for this selection.</p>
          <a
            href={`/checkout?shared=${token}`}
            className="px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
}