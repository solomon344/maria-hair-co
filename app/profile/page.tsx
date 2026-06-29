"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, Bell, ChevronRight, Edit2, Plus, Trash2, Star, Clock, Shield, Mail, Phone, Camera } from "lucide-react";

type ProfileTab = "details" | "orders" | "addresses" | "wishlist" | "preferences";

const tabs: { key: ProfileTab; label: string; icon: typeof User }[] = [
  { key: "details", label: "Account Details", icon: User },
  { key: "orders", label: "Order History", icon: Package },
  { key: "addresses", label: "Address Book", icon: MapPin },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "preferences", label: "Preferences", icon: Bell },
];

const mockOrders = [
  { id: "#MHC-1024", date: "Jun 15, 2026", status: "Delivered", items: 3, total: 98.00, eta: null },
  { id: "#MHC-1025", date: "Jun 20, 2026", status: "Shipped", items: 2, total: 64.00, eta: "Jun 24" },
  { id: "#MHC-1026", date: "Jun 25, 2026", status: "Processing", items: 1, total: 34.00, eta: "Jun 28" },
];

const mockAddresses = [
  { id: 1, name: "Home", street: "123 Main Street", apt: "Apt 4B", city: "Brooklyn", state: "NY", zip: "11201", isDefault: true },
  { id: 2, name: "Work", street: "456 Business Ave", apt: "Suite 200", city: "Manhattan", state: "NY", zip: "10001", isDefault: false },
];

const mockWishlist = [
  { name: "Nourishing Oil", tagline: "Daily shine and split-end seal", image: "/nourishing.jpeg", price: 28.00 },
  { name: "Repair Mask", tagline: "Deep recovery for damaged hair", image: "/repair-mask.jpeg", price: 42.00 },
  { name: "Hair Perfume", tagline: "Lightweight signature scent", image: "/hydrating.jpeg", price: 22.00 },
];

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);

  const [profile, setProfile] = useState({
    firstName: "Amara",
    lastName: "Kodjoe",
    email: "amara.k@example.com",
    phone: "+1 (555) 234-5678",
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    tips: true,
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#e8dfd3] flex items-center justify-center text-[#533a00] text-2xl font-header font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <div>
                <h3 className="font-header font-bold text-[#1a120b] text-xl">{profile.firstName} {profile.lastName}</h3>
                <p className="text-[#6a5a4a] font-body text-sm">{profile.email}</p>
                <button className="mt-2 flex items-center gap-1.5 text-xs text-[#533a00] font-body font-semibold hover:underline">
                  <Camera className="w-3.5 h-3.5" />
                  Change Photo
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div className="border border-[#e8dfd3] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-header font-bold text-[#1a120b] text-lg">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 text-sm text-[#533a00] font-body font-semibold hover:underline"
                >
                  {isEditing ? "Cancel" : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors disabled:bg-[#faf7f2] disabled:text-[#6a5a4a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
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
                  <button className="px-6 py-3 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors">
                    Save Changes
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

            {/* Password */}
            <div className="border border-[#e8dfd3] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-header font-bold text-[#1a120b] text-lg">Password</h3>
                <Shield className="w-5 h-5 text-[#6a5a4a]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
              </div>
              <button className="mt-5 px-6 py-3 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors">
                Update Password
              </button>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div key={order.id} className="border border-[#e8dfd3] p-6 hover:bg-[#faf7f2] transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-header font-bold text-[#1a120b]">{order.id}</h3>
                    <p className="text-[#8a7a6a] text-sm font-body mt-0.5">{order.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-50 text-green-700"
                      : order.status === "Shipped"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-[#6a5a4a] font-body">
                    <span>{order.items} item{order.items > 1 ? "s" : ""}</span>
                    {order.eta && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Est. {order.eta}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-header font-bold text-[#533a00]">${order.total.toFixed(2)}</span>
                    <ChevronRight className="w-4 h-4 text-[#c4b5a0] group-hover:text-[#533a00] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6a5a4a] font-body">Manage your shipping addresses</p>
              <button className="flex items-center gap-1.5 text-sm text-[#533a00] font-body font-semibold hover:underline">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {mockAddresses.map((addr) => (
              <div key={addr.id} className="border border-[#e8dfd3] p-6 relative">
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 bg-[#533a00] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold">
                    Default
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-header font-bold text-[#1a120b]">{addr.name}</h3>
                    </div>
                    <p className="text-[#6a5a4a] font-body text-sm">{addr.street}</p>
                    <p className="text-[#6a5a4a] font-body text-sm">{addr.apt}</p>
                    <p className="text-[#6a5a4a] font-body text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingAddress(editingAddress === addr.id ? null : addr.id)}
                      className="text-xs text-[#6a5a4a] font-body hover:text-[#533a00] transition-colors"
                    >
                      Edit
                    </button>
                    <button className="text-xs text-[#6a5a4a] font-body hover:text-red-500 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>

                {editingAddress === addr.id && (
                  <div className="mt-6 pt-6 border-t border-[#e8dfd3] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Street</label>
                        <input
                          type="text"
                          defaultValue={addr.street}
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Apt / Suite</label>
                        <input
                          type="text"
                          defaultValue={addr.apt}
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="px-6 py-2.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors">
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAddress(null)}
                        className="text-sm text-[#6a5a4a] font-body hover:text-[#533a00] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "wishlist":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockWishlist.map((item) => (
              <div key={item.name} className="flex gap-4 border border-[#e8dfd3] p-4 group">
                <div className="w-24 h-28 shrink-0 bg-[#f5f0eb] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-header font-bold text-[#1a120b] text-sm">{item.name}</h3>
                      <button className="p-1 text-[#c4b5a0] hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                      </button>
                    </div>
                    <p className="text-[#8a7a6a] text-xs font-body mt-0.5">{item.tagline}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-header font-bold text-[#533a00]">${item.price.toFixed(2)}</span>
                    <button className="text-xs px-4 py-2 bg-[#533a00] text-white uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-8">
            {/* Notifications */}
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
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          notifications[n.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication */}
            <div className="border border-[#e8dfd3] p-6 md:p-8">
              <h3 className="font-header font-bold text-[#1a120b] text-lg mb-6">Communication</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Email Frequency</label>
                  <select className="w-full sm:w-64 border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors bg-white appearance-none">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option selected>Monthly</option>
                    <option>Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">SMS Updates</label>
                  <div className="flex items-center gap-3">
                    <button className={`relative w-11 h-6 rounded-full transition-colors ${
                      true ? "bg-[#533a00]" : "bg-[#e8dfd3]"
                    }`}>
                      <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-5" />
                    </button>
                    <span className="text-sm text-[#6a5a4a] font-body">+1 (555) 234-5678</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors">
              Save Preferences
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-[#8a7a6a]">
            <a href="/" className="hover:text-[#533a00] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#533a00] font-semibold">My Account</span>
          </nav>
        </div>
      </div>

      {/* ─── Page Header ─── */}
      <div className="bg-[#faf7f2] border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold mb-2">Account</p>
          <h1 className="text-3xl md:text-4xl font-header text-[#1a120b]">My Account</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ─── Sidebar ─── */}
          <aside className="lg:w-64 shrink-0">
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 sticky top-28">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-body whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? "bg-[#faf7f2] text-[#533a00] font-semibold border-l-2 border-[#533a00]"
                        : "text-[#6a5a4a] hover:text-[#533a00] hover:bg-[#faf7f2]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ─── Content ─── */}
          <div className="flex-1 min-w-0">
            {renderTabContent()}
          </div>

        </div>
      </div>
    </div>
  );
}