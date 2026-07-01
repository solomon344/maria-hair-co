"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, Package, MapPin, Heart, ChevronRight, Edit2, Plus, Trash2, Clock, Shield, Mail, Phone, Camera, Bell } from "lucide-react";

type ProfileTab = "details" | "orders" | "addresses" | "wishlist" | "preferences";

const tabs: { key: ProfileTab; label: string; icon: typeof User }[] = [
  { key: "details", label: "Account Details", icon: User },
  { key: "orders", label: "Order History", icon: Package },
  { key: "addresses", label: "Address Book", icon: MapPin },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "preferences", label: "Preferences", icon: Bell },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState<ProfileTab>("details");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    tips: true,
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as any;
      setProfile((prev) => ({
        ...prev,
        name: user?.name || prev.name,
        email: user?.email || prev.email,
        image: user?.image || prev.image,
        phone: user?.phone ?? prev.phone,
      }));
    }
  }, [status, session]);

  useEffect(() => {
    const loadProfile = async () => {
      if (status !== "authenticated") return;
      try {
        const res = await fetch("/api/profile/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            image: data.user.image || "",
          });
          setNotifications({
            orderUpdates: data.user.notifyOrderUpdates ?? true,
            promotions: data.user.notifyPromotions ?? false,
            newArrivals: data.user.notifyNewArrivals ?? true,
            tips: data.user.notifyTips ?? true,
          });
        }
      } catch {
        // ignore
      }
    };
    loadProfile();
  }, [status]);

  useEffect(() => {
    const loadTabData = async () => {
      if (status !== "authenticated") return;
      setLoadingData(true);
      try {
        if (activeTab === "orders") {
          const res = await fetch("/api/profile/orders");
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || data || []);
          }
        } else if (activeTab === "addresses") {
          const res = await fetch("/api/profile/addresses");
          if (res.ok) {
            const data = await res.json();
            setAddresses(data.addresses || data || []);
          }
        } else if (activeTab === "wishlist") {
          const res = await fetch("/api/profile/wishlist");
          if (res.ok) {
            const data = await res.json();
            setWishlist(data.items || data.wishlist || data || []);
          }
        } else if (activeTab === "details") {
          const res = await fetch("/api/profile/me");
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setProfile({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                image: data.user.image || "",
              });
            }
          }
        }
      } catch {
        // ignore
      } finally {
        setLoadingData(false);
      }
    };
    loadTabData();
  }, [status, activeTab]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-body text-[#6a5a4a]">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        const data = await res.json();
        if (data.user) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            phone: data.user.phone ?? prev.phone,
            image: data.user.image || prev.image,
          }));
        }
        await update();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifyOrderUpdates: notifications.orderUpdates,
          notifyPromotions: notifications.promotions,
          notifyNewArrivals: notifications.newArrivals,
          notifyTips: notifications.tips,
        }),
      });
      if (res.ok) {
        alert("Preferences saved");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#e8dfd3] flex items-center justify-center text-[#533a00] text-2xl font-header font-bold overflow-hidden">
                {profile.image ? (
                  <img src={profile.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>{profile.name ? profile.name[0] : "U"}</>
                )}
              </div>
              <div>
                <h3 className="font-header font-bold text-[#1a120b] text-xl">{profile.name || "User"}</h3>
                <p className="text-[#6a5a4a] font-body text-sm">{profile.email}</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="border border-[#e8dfd3] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-header font-bold text-[#1a120b] text-lg">Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-sm text-[#533a00] font-body font-semibold hover:underline"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors disabled:bg-[#faf7f2] disabled:text-[#6a5a4a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4b5a0]" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full border border-[#e8dfd3] pl-10 pr-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors disabled:bg-[#faf7f2] disabled:text-[#6a5a4a]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4b5a0]" />
                    <input
                      type="tel"
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full border border-[#e8dfd3] pl-10 pr-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors disabled:bg-[#faf7f2] disabled:text-[#6a5a4a]"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex items-center gap-4">
                  <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-70">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-[#e8dfd3] text-[#6a5a4a] text-xs uppercase tracking-wider font-semibold hover:bg-[#faf7f2] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "orders":
        if (loadingData) {
          return <p className="text-sm text-[#6a5a4a]">Loading orders...</p>;
        }
        if (!orders.length) {
          return <p className="text-sm text-[#6a5a4a]">No orders yet.</p>;
        }
        return (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-[#e8dfd3] p-6 hover:bg-[#faf7f2] transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-header font-bold text-[#1a120b]">{order.id}</h3>
                    <p className="text-[#8a7a6a] text-sm font-body mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                    order.status === "DELIVERED" ? "bg-green-50 text-green-700" : order.status === "SHIPPED" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                  }`}>{order.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-[#6a5a4a] font-body">
                    <span>{order.items?.length || 0} items</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-header font-bold text-[#533a00]">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "addresses":
        if (loadingData) {
          return <p className="text-sm text-[#6a5a4a]">Loading addresses...</p>;
        }
        if (!addresses.length) {
          return <p className="text-sm text-[#6a5a4a]">No addresses saved.</p>;
        }
        return (
          <div className="space-y-6">
            {addresses.map((addr: any) => (
              <div key={addr.id} className="border border-[#e8dfd3] p-6 relative">
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 bg-[#533a00] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold">Default</span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-header font-bold text-[#1a120b]">{addr.name || "Address"}</h3>
                    <p className="text-[#6a5a4a] font-body text-sm">{addr.street}</p>
                    <p className="text-[#6a5a4a] font-body text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "wishlist":
        if (loadingData) {
          return <p className="text-sm text-[#6a5a4a]">Loading wishlist...</p>;
        }
        if (!wishlist.length) {
          return <p className="text-sm text-[#6a5a4a]">No wishlist items yet.</p>;
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wishlist.map((item: any) => (
              <div key={item.id || item.productId} className="flex gap-4 border border-[#e8dfd3] p-4 group">
                <div className="w-24 h-28 shrink-0 bg-[#f5f0eb] overflow-hidden">
                  <img src={item.product?.image || item.image} alt={item.product?.name || item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-header font-bold text-[#1a120b] text-sm">{item.product?.name || item.name}</h3>
                    </div>
                    <p className="text-[#8a7a6a] text-xs font-body mt-0.5">{item.product?.tagline || item.tagline}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-header font-bold text-[#533a00]">${Number(item.product?.price || item.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-8">
            <div className="border border-[#e8dfd3] p-6 md:p-8">
              <h3 className="font-header font-bold text-[#1a120b] text-lg mb-6">Notification Preferences</h3>
              <div className="space-y-5">
                {[
                  { key: "orderUpdates" as const, label: "Order Updates", desc: "Receive real-time updates on your orders" },
                  { key: "promotions" as const, label: "Promotions & Offers", desc: "Exclusive discounts and early access to sales" },
                  { key: "newArrivals" as const, label: "New Arrivals", desc: "Be the first to know about new products" },
                  { key: "tips" as const, label: "Hair Care Tips", desc: "Weekly tips from our trichologist team" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-sm text-[#1a120b] font-semibold">{n.label}</p>
                      <p className="text-[#8a7a6a] text-xs font-body">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[n.key] ? "bg-[#533a00]" : "bg-[#e8dfd3]"
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        notifications[n.key] ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4">
                <button onClick={handleSavePreferences} disabled={saving} className="px-6 py-3 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-70">
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-[#8a7a6a]">
            <a href="/" className="hover:text-[#533a00] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#533a00] font-semibold">My Account</span>
          </nav>
        </div>
      </div>

      <div className="bg-[#faf7f2] border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold mb-2">Account</p>
          <h1 className="text-3xl md:text-4xl font-header text-[#1a120b]">My Account</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-64 shrink-0">
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 sticky top-28">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-3 px-4 py-3 text-sm font-body whitespace-nowrap transition-colors ${
                    activeTab === tab.key ? "bg-[#faf7f2] text-[#533a00] font-semibold border-l-2 border-[#533a00]" : "text-[#6a5a4a] hover:text-[#533a00] hover:bg-[#faf7f2]"
                  }`}>
                    <Icon className="w-4 h-4 shrink-0" /> {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>
          <div className="flex-1 min-w-0">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}