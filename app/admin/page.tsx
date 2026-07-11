"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingBag, Users, Mail, Printer, ArrowLeft, Send, Box, Plus, Trash2, Check, ChevronDown, Upload, X, Tags, PlusCircle } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";

type AdminTab = "orders" | "users" | "products" | "categories" | "email";
type EmailTemplate = "hair-tips" | "general" | "new-products";

interface ProductForm {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  price: string;
  categoryId: string;
  badge: string;
  stockQty: string;
  size: string;
  ingredients: string[];
  howToUse: string[];
  keyBenefits: string[];
  hairType: string[];
}

interface CategoryForm {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { edgestore } = useEdgeStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailTab, setEmailTab] = useState<"compose" | "templates">("compose");
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>("general");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryForm | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string>("");
  const [selectedCategoryFile, setSelectedCategoryFile] = useState<File | null>(null);
  const [catImageUrlInput, setCatImageUrlInput] = useState("");

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && !isAdmin) {
      router.push("/");
    }
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== "authenticated" || !isAdmin) return;

    if (activeTab === "orders") {
      loadOrders();
    } else if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "products") {
      loadProducts();
      loadCategories();
    } else if (activeTab === "categories") {
      loadCategories();
    } else if (activeTab === "email") {
      loadUsers();
    }
  }, [status, activeTab, isAdmin]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      // ignore
    }
  };

  const handlePrintOrder = (orderId: string) => {
    window.open(`/api/admin/orders/${orderId}/print`, "_blank");
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: selectedUsers,
          subject,
          message,
          template: emailTemplate,
        }),
      });

      if (res.ok) {
        alert("Email sent successfully!");
        setSelectedUsers([]);
        setSubject("");
        setMessage("");
      } else {
        alert("Failed to send email");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const handleNotifyNewProducts = async () => {
    setNotifying(true);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "new-products",
          recipients: "all",
        }),
      });

      if (res.ok) {
        alert("New products notification sent to all users!");
      } else {
        alert("Failed to send notification");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setNotifying(false);
    }
  };

  const toggleUserSelection = (email: string) => {
    setSelectedUsers((prev) => (prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const res = await edgestore.publicFiles.upload({
        file: selectedFile,
        options: {
          replaceTargetUrl: editingProduct?.image || undefined,
        },
      });
      setImagePreview(res.url);
      setEditingProduct({ ...editingProduct, image: res.url } as ProductForm);
      setSelectedFile(null);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCategoryImageUpload = async () => {
    if (!selectedCategoryFile) return;
    setUploadingCategoryImage(true);
    try {
      const res = await edgestore.publicFiles.upload({
        file: selectedCategoryFile,
        options: {
          replaceTargetUrl: editingCategory?.image || undefined,
        },
      });
      setCategoryImagePreview(res.url);
      setEditingCategory({ ...editingCategory, image: res.url } as CategoryForm);
      setSelectedCategoryFile(null);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingCategoryImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const url = editingProduct?.id ? "/api/admin/products" : "/api/admin/products";
      const method = editingProduct?.id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingProduct?.id && { id: editingProduct.id }),
          slug: editingProduct?.slug,
          name: editingProduct?.name,
          tagline: editingProduct?.tagline,
          description: editingProduct?.description,
          image: editingProduct?.image,
          price: parseFloat(editingProduct?.price || "0"),
          categoryId: editingProduct?.categoryId || null,
          badge: editingProduct?.badge,
          stockQty: parseInt(editingProduct?.stockQty || "0"),
          size: editingProduct?.size || "",
          ingredients: editingProduct?.ingredients || [],
          howToUse: editingProduct?.howToUse || [],
          keyBenefits: editingProduct?.keyBenefits || [],
          hairType: editingProduct?.hairType || [],
        }),
      });

      if (res.ok) {
        setShowProductForm(false);
        setEditingProduct(null);
        setImagePreview("");
        loadProducts();
      } else {
        alert("Failed to save product");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct({
      id: product.id,
      slug: product.slug,
      name: product.name,
      tagline: product.tagline || "",
      description: product.description,
      image: product.image,
      price: product.price.toString(),
      categoryId: product.categoryId || "",
      badge: product.badge || "",
      stockQty: product.stockQty.toString(),
      size: product.size || "",
      ingredients: product.ingredients || [],
      howToUse: product.howToUse || [],
      keyBenefits: product.keyBenefits || [],
      hairType: product.hairType || [],
    });
    setImagePreview(product.image);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const product = products.find((p) => p.id === id);
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        if (product?.image) {
          try {
            await edgestore.publicFiles.delete({ url: product.image });
          } catch (error) {
            console.error("Failed to delete image:", error);
          }
        }
        loadProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategory(true);
    try {
      const url = editingCategory?.id ? "/api/admin/categories" : "/api/admin/categories";
      const method = editingCategory?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingCategory?.id && { id: editingCategory.id }),
          name: editingCategory?.name,
          slug: editingCategory?.slug,
          description: editingCategory?.description,
          image: editingCategory?.image,
        }),
      });

      if (res.ok) {
        setShowCategoryForm(false);
        setEditingCategory(null);
        setCategoryImagePreview("");
        loadCategories();
      } else {
        alert("Failed to save category");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products in this category will be unlinked.")) return;
    try {
      const category = categories.find((c) => c.id === id);
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        if (category?.image) {
          try {
            await edgestore.publicFiles.delete({ url: category.image });
          } catch (error) {
            console.error("Failed to delete category image:", error);
          }
        }
        loadCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const openCategoryForm = (cat?: any) => {
    if (cat) {
      setEditingCategory({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        image: cat.image || "",
      });
      setCategoryImagePreview(cat.image || "");
    } else {
      setEditingCategory(null);
      setCategoryImagePreview("");
    }
    setSelectedCategoryFile(null);
    setCatImageUrlInput("");
    setShowCategoryForm(true);
  };

  const addArrayItem = (field: keyof ProductForm) => {
    setEditingProduct((prev) => {
      if (!prev) return prev;
      const arr = prev[field] as string[] || [];
      return { ...prev, [field]: [...arr, ""] };
    });
  };

  const updateArrayItem = (field: keyof ProductForm, index: number, value: string) => {
    setEditingProduct((prev) => {
      if (!prev) return prev;
      const arr = [...(prev[field] as string[] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field: keyof ProductForm, index: number) => {
    setEditingProduct((prev) => {
      if (!prev) return prev;
      const arr = [...(prev[field] as string[] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm font-body text-[#6a5a4a]">Loading...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  const templates = {
    "hair-tips": {
      subject: "Hair Care Tips from Mariéa 💇‍♀️",
      body: `Dear {name},

Here are this week's hair care tips from our trichologist team:

1. **Hydrate Regularly** - Use a moisturizing shampoo and conditioner suited for your hair type.
2. **Avoid Heat Damage** - Limit heat styling and always use a heat protectant.
3. **Trim Regularly** - Get a trim every 8-10 weeks to prevent split ends.
4. **Deep Condition** - Use a deep conditioning treatment once a week.
5. **Protect Your Hair** - Wear a silk or satin bonnet at night to prevent breakage.

Wishing you beautiful, healthy hair!

Warm regards,
The Mariéa Hair Co. Team`,
    },
    general: {
      subject: "Update from Mariéa Hair Co. ✨",
      body: `Hi {name},

We hope this email finds you well!

We're excited to share some updates with you:
- New product launches coming soon
- Exclusive discounts for our loyal customers
- Free shipping on orders over $50

Thank you for being part of the Mariéa family!

Best regards,
The Mariéa Hair Co. Team`,
    },
    "new-products": {
      subject: "New Products Just Dropped! ✨",
      body: `Hi {name},

Exciting news! We've just added some amazing new products to our collection:

{products}

Shop them now at [link]

Best regards,
The Mariéa Hair Co. Team`,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-header text-[#1a120b]">Admin Dashboard</h1>
            <p className="text-sm text-[#6a5a4a] font-body mt-1">Welcome, {session.user?.name}</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-[#6a5a4a] hover:text-[#533a00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>
        </div>

        <div className="flex flex-row border-b border-[#e8dfd3] mb-8 overflow-x-auto">
          {[
            { key: "orders" as AdminTab, label: "Orders", icon: ShoppingBag },
            { key: "users" as AdminTab, label: "Users", icon: Users },
            { key: "products" as AdminTab, label: "Products", icon: Box },
            { key: "categories" as AdminTab, label: "Categories", icon: Tags },
            { key: "email" as AdminTab, label: "Send Email", icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-body font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-[#533a00] text-[#533a00]"
                    : "border-transparent text-[#6a5a4a] hover:text-[#533a00]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-header font-bold text-[#1a120b] mb-6">Order Management</h2>
            {loading ? (
              <p className="text-sm text-[#6a5a4a]">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-[#6a5a4a]">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-[#e8dfd3] p-6 hover:bg-[#faf7f2] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-header font-bold text-[#1a120b]">{order.id}</h3>
                        <p className="text-[#8a7a6a] text-sm font-body mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-[#6a5a4a] text-sm font-body">{order.customerEmail}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold bg-amber-50 text-amber-700">
                          {order.status}
                        </span>
                        <button
                          onClick={() => handlePrintOrder(order.id)}
                          className="p-2 text-[#6a5a4a] hover:text-[#533a00] transition-colors"
                          title="Print order"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6a5a4a] font-body">{order.items?.length || 0} items</span>
                      <span className="font-header font-bold text-[#533a00]">${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-header font-bold text-[#1a120b] mb-6">All Users</h2>
            {loading ? (
              <p className="text-sm text-[#6a5a4a]">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-[#6a5a4a]">No users found.</p>
            ) : (
              <div className="border border-[#e8dfd3] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#faf7f2]">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Phone</th>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8dfd3]">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-[#faf7f2] transition-colors">
                        <td className="px-6 py-4 text-sm font-body text-[#1a120b]">{user.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">{user.email}</td>
                        <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">{user.phone || "N/A"}</td>
                        <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-header font-bold text-[#1a120b]">Products</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNotifyNewProducts}
                  disabled={notifying || products.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-70"
                >
                  <Mail className="w-4 h-4" />
                  {notifying ? "Notifying..." : "Notify users of new products"}
                </button>
                <button
                  onClick={() => {
                    setEditingProduct({
                      slug: "",
                      name: "",
                      tagline: "",
                      description: "",
                      image: "",
                      price: "",
                      categoryId: "",
                      badge: "",
                      stockQty: "0",
                      size: "",
                      ingredients: [],
                      howToUse: [],
                      keyBenefits: [],
                      hairType: [],
                    });
                    setImagePreview("");
                    setShowProductForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </div>

            {showProductForm && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 border border-[#e8dfd3] p-6 bg-[#faf7f2]">
                  <h3 className="font-header font-bold text-[#1a120b] mb-4">{editingProduct?.id ? "Edit Product" : "New Product"}</h3>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Name *</label>
                        <input
                          type="text"
                          value={editingProduct?.name || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value } as ProductForm)}
                          required
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Slug *</label>
                        <input
                          type="text"
                          value={editingProduct?.slug || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value } as ProductForm)}
                          required
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Price *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingProduct?.price || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value } as ProductForm)}
                          required
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Category</label>
                        <select
                          value={editingProduct?.categoryId || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value } as ProductForm)}
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] bg-white"
                        >
                          <option value="">No category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Badge</label>
                        <input
                          type="text"
                          value={editingProduct?.badge || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value } as ProductForm)}
                          placeholder="e.g. Bestseller, New"
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Size</label>
                        <input
                          type="text"
                          value={editingProduct?.size || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value } as ProductForm)}
                          placeholder="e.g. 8 fl oz / 237 mL"
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Stock Qty</label>
                        <input
                          type="number"
                          value={editingProduct?.stockQty || "0"}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stockQty: e.target.value } as ProductForm)}
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Tagline</label>
                        <input
                          type="text"
                          value={editingProduct?.tagline || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value } as ProductForm)}
                          placeholder="Short product tagline"
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFile(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#533a00] file:text-white file:cursor-pointer hover:file:bg-[#3d2b1f]"
                        />
                        {imagePreview && (
                          <div className="mt-3 relative inline-block">
                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover border border-[#e8dfd3]" />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview("");
                                setSelectedFile(null);
                                setEditingProduct({ ...editingProduct, image: "" } as ProductForm);
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {uploadingImage && <p className="text-xs text-[#6a5a4a] mt-1">Uploading...</p>}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Description *</label>
                      <textarea
                        value={editingProduct?.description || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value } as ProductForm)}
                        required
                        rows={3}
                        className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                      />
                    </div>

                    {/* Key Benefits */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-body text-[#6a5a4a]">Key Benefits</label>
                        <button type="button" onClick={() => addArrayItem("keyBenefits")} className="text-xs text-[#533a00] font-semibold flex items-center gap-1 hover:underline">
                          <PlusCircle className="w-3 h-3" /> Add
                        </button>
                      </div>
                      {(editingProduct?.keyBenefits || []).map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => updateArrayItem("keyBenefits", i, e.target.value)}
                            placeholder="Benefit"
                            className="flex-1 border border-[#e8dfd3] px-4 py-2 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                          />
                          <button type="button" onClick={() => removeArrayItem("keyBenefits", i)} className="p-1 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Ingredients */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-body text-[#6a5a4a]">Ingredients</label>
                        <button type="button" onClick={() => addArrayItem("ingredients")} className="text-xs text-[#533a00] font-semibold flex items-center gap-1 hover:underline">
                          <PlusCircle className="w-3 h-3" /> Add
                        </button>
                      </div>
                      {(editingProduct?.ingredients || []).map((ing, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={ing}
                            onChange={(e) => updateArrayItem("ingredients", i, e.target.value)}
                            placeholder="Ingredient"
                            className="flex-1 border border-[#e8dfd3] px-4 py-2 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                          />
                          <button type="button" onClick={() => removeArrayItem("ingredients", i)} className="p-1 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* How to Use */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-body text-[#6a5a4a]">How to Use</label>
                        <button type="button" onClick={() => addArrayItem("howToUse")} className="text-xs text-[#533a00] font-semibold flex items-center gap-1 hover:underline">
                          <PlusCircle className="w-3 h-3" /> Add
                        </button>
                      </div>
                      {(editingProduct?.howToUse || []).map((step, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-[#533a00] text-white text-xs flex items-center justify-center font-semibold shrink-0">{i + 1}</span>
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => updateArrayItem("howToUse", i, e.target.value)}
                            placeholder="Step"
                            className="flex-1 border border-[#e8dfd3] px-4 py-2 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                          />
                          <button type="button" onClick={() => removeArrayItem("howToUse", i)} className="p-1 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Hair Type */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-body text-[#6a5a4a]">Hair Types</label>
                        <button type="button" onClick={() => addArrayItem("hairType")} className="text-xs text-[#533a00] font-semibold flex items-center gap-1 hover:underline">
                          <PlusCircle className="w-3 h-3" /> Add
                        </button>
                      </div>
                      {(editingProduct?.hairType || []).map((type, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={type}
                            onChange={(e) => updateArrayItem("hairType", i, e.target.value)}
                            placeholder="e.g. Curly, Coily, Wavy"
                            className="flex-1 border border-[#e8dfd3] px-4 py-2 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                          />
                          <button type="button" onClick={() => removeArrayItem("hairType", i)} className="p-1 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingProduct}
                        className="px-6 py-3 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-70"
                      >
                        {savingProduct ? "Saving..." : "Save Product"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                          setImagePreview("");
                          setSelectedFile(null);
                        }}
                        className="px-6 py-3 border border-[#e8dfd3] text-[#6a5a4a] text-xs uppercase tracking-wider font-semibold hover:bg-[#faf7f2] transition-colors"
                      >
                        Cancel
                      </button>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="px-6 py-3 border border-[#533a00] text-[#533a00] text-xs uppercase tracking-wider font-semibold hover:bg-[#533a00] hover:text-white transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingImage ? "Uploading..." : "Upload Image"}
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-1">
                  <div className="border border-[#e8dfd3] p-6 bg-white sticky top-28">
                    <h3 className="text-sm font-body font-semibold text-[#6a5a4a] uppercase tracking-wider mb-4">Preview</h3>
                    <div className="border border-[#e8dfd3] bg-[#faf7f2]">
                      {imagePreview || editingProduct?.image ? (
                        <div className="aspect-square bg-[#f5f0eb] overflow-hidden">
                          <img
                            src={imagePreview || editingProduct?.image}
                            alt={editingProduct?.name || "Preview"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-[#f5f0eb] flex items-center justify-center">
                          <div className="text-center p-6">
                            <Box className="w-12 h-12 text-[#e8dfd3] mx-auto mb-2" />
                            <p className="text-xs text-[#8a7a6a] font-body">Image preview</p>
                          </div>
                        </div>
                      )}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-xs text-[#8a7a6a] font-body mb-0.5">
                            {editingProduct?.categoryId
                              ? categories.find((c) => c.id === editingProduct.categoryId)?.name || "Category"
                              : "No category"}
                          </p>
                          <h4 className="font-header font-bold text-[#1a120b] text-lg leading-tight">
                            {editingProduct?.name || "Product Name"}
                          </h4>
                          {editingProduct?.tagline && (
                            <p className="text-xs text-[#6a5a4a] font-body mt-1">{editingProduct.tagline}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#e8dfd3]">
                          <span className="font-header font-bold text-[#533a00] text-xl">
                            {editingProduct?.price ? `$${parseFloat(editingProduct.price).toFixed(2)}` : "$0.00"}
                          </span>
                          {editingProduct?.badge && (
                            <span className="px-2 py-1 bg-[#533a00] text-white text-[10px] uppercase tracking-wider font-semibold">
                              {editingProduct.badge}
                            </span>
                          )}
                        </div>
                        <div className="pt-3 border-t border-[#e8dfd3]">
                          <p className="text-xs text-[#8a7a6a] font-body line-clamp-3">
                            {editingProduct?.description || "Product description will appear here..."}
                          </p>
                        </div>
                        {editingProduct?.stockQty && (
                          <div className="pt-3 border-t border-[#e8dfd3] flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${parseInt(editingProduct.stockQty) > 0 ? "bg-green-500" : "bg-red-500"}`} />
                            <span className="text-xs text-[#6a5a4a] font-body">
                              {parseInt(editingProduct.stockQty) > 0 ? `In Stock (${editingProduct.stockQty})` : "Out of Stock"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!showProductForm && (
              <div>
                {loading ? (
                  <p className="text-sm text-[#6a5a4a]">Loading products...</p>
                ) : products.length === 0 ? (
                  <p className="text-sm text-[#6a5a4a]">No products found.</p>
                ) : (
                  <div className="border border-[#e8dfd3] overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#faf7f2]">
                        <tr>
                          <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Image</th>
                          <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Name</th>
                          <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Category</th>
                          <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Price</th>
                          <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Stock</th>
                          <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8dfd3]">
                        {products.map((product: any) => (
                          <tr key={product.id} className="hover:bg-[#faf7f2] transition-colors">
                            <td className="px-6 py-4">
                              {product.image && (
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover border border-[#e8dfd3]" />
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm font-body text-[#1a120b]">{product.name}</td>
                            <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">
                              {product.category?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">${Number(product.price).toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">{product.stockQty}</td>
                            <td className="px-6 py-4 text-sm font-body">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-[#533a00] hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-header font-bold text-[#1a120b]">Categories</h2>
              <button
                onClick={() => openCategoryForm()}
                className="flex items-center gap-2 px-4 py-2 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            {showCategoryForm && (
              <div className="border border-[#e8dfd3] p-6 mb-6 bg-[#faf7f2] max-w-lg">
                <h3 className="font-header font-bold text-[#1a120b] mb-4">{editingCategory?.id ? "Edit Category" : "New Category"}</h3>
                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Name *</label>
                    <input
                      type="text"
                      value={editingCategory?.name || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value } as CategoryForm)}
                      required
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Slug *</label>
                    <input
                      type="text"
                      value={editingCategory?.slug || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value } as CategoryForm)}
                      required
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Image</label>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#8a7a6a] font-body mb-1">Upload a file</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedCategoryFile(file);
                              setCategoryImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#533a00] file:text-white file:cursor-pointer hover:file:bg-[#3d2b1f]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-[#e8dfd3]" />
                        <span className="text-xs text-[#8a7a6a] font-body">or paste URL</span>
                        <div className="flex-1 h-px bg-[#e8dfd3]" />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={catImageUrlInput}
                          onChange={(e) => {
                            setCatImageUrlInput(e.target.value);
                            setCategoryImagePreview(e.target.value);
                            setEditingCategory({ ...editingCategory, image: e.target.value } as CategoryForm);
                            setSelectedCategoryFile(null);
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] placeholder:text-[#c4b5a0]"
                        />
                      </div>
                    </div>
                    {categoryImagePreview && (
                      <div className="mt-3 relative inline-block">
                        <img src={categoryImagePreview} alt="Category preview" className="w-32 h-32 object-cover border border-[#e8dfd3]" />
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryImagePreview("");
                            setSelectedCategoryFile(null);
                            setCatImageUrlInput("");
                            setEditingCategory({ ...editingCategory, image: "" } as CategoryForm);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {uploadingCategoryImage && <p className="text-xs text-[#6a5a4a] mt-1">Uploading...</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Description</label>
                    <textarea
                      value={editingCategory?.description || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value } as CategoryForm)}
                      rows={3}
                      className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={savingCategory}
                      className="px-6 py-3 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-70"
                    >
                      {savingCategory ? "Saving..." : "Save Category"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        setCategoryImagePreview("");
                        setSelectedCategoryFile(null);
                        setCatImageUrlInput("");
                      }}
                      className="px-6 py-3 border border-[#e8dfd3] text-[#6a5a4a] text-xs uppercase tracking-wider font-semibold hover:bg-[#faf7f2] transition-colors"
                    >
                      Cancel
                    </button>
                    {selectedCategoryFile && (
                      <button
                        type="button"
                        onClick={handleCategoryImageUpload}
                        disabled={uploadingCategoryImage}
                        className="px-6 py-3 border border-[#533a00] text-[#533a00] text-xs uppercase tracking-wider font-semibold hover:bg-[#533a00] hover:text-white transition-colors flex items-center gap-2 disabled:opacity-70"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingCategoryImage ? "Uploading..." : "Upload Image"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {categories.length === 0 ? (
              <p className="text-sm text-[#6a5a4a]">No categories found.</p>
            ) : (
              <div className="border border-[#e8dfd3] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#faf7f2]">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Image</th>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Slug</th>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Products</th>
                      <th className="text-left px-6 py-3 text-xs font-body font-semibold text-[#6a5a4a] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8dfd3]">
                    {categories.map((cat: any) => (
                      <tr key={cat.id} className="hover:bg-[#faf7f2] transition-colors">
                        <td className="px-6 py-4">
                          {cat.image && (
                            <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover border border-[#e8dfd3]" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-body text-[#1a120b]">{cat.name}</td>
                        <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">{cat.slug}</td>
                        <td className="px-6 py-4 text-sm font-body text-[#6a5a4a]">{cat._count?.products || 0}</td>
                        <td className="px-6 py-4 text-sm font-body">
                          <div className="flex items-center gap-3">
                            <button onClick={() => openCategoryForm(cat)} className="text-[#533a00] hover:underline">Edit</button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "email" && (
          <div>
            <h2 className="text-xl font-header font-bold text-[#1a120b] mb-6">Send Email</h2>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setEmailTab("compose")}
                className={`px-4 py-2 text-sm font-body font-semibold transition-colors border-b-2 ${
                  emailTab === "compose" ? "border-[#533a00] text-[#533a00]" : "border-transparent text-[#6a5a4a]"
                }`}
              >
                Compose
              </button>
              <button
                onClick={() => setEmailTab("templates")}
                className={`px-4 py-2 text-sm font-body font-semibold transition-colors border-b-2 ${
                  emailTab === "templates" ? "border-[#533a00] text-[#533a00]" : "border-transparent text-[#6a5a4a]"
                }`}
              >
                Templates
              </button>
            </div>

            {emailTab === "templates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <button
                  onClick={() => {
                    setEmailTemplate("general");
                    setEmailTab("compose");
                    setSubject(templates.general.subject);
                    setMessage(templates.general.body);
                  }}
                  className="border border-[#e8dfd3] p-6 text-left hover:bg-[#faf7f2] transition-colors"
                >
                  <h3 className="font-header font-bold text-[#1a120b] mb-2">General Newsletter</h3>
                  <p className="text-sm text-[#6a5a4a] font-body">Company updates, promotions, and general announcements</p>
                </button>
                <button
                  onClick={() => {
                    setEmailTemplate("hair-tips");
                    setEmailTab("compose");
                    setSubject(templates["hair-tips"].subject);
                    setMessage(templates["hair-tips"].body);
                  }}
                  className="border border-[#e8dfd3] p-6 text-left hover:bg-[#faf7f2] transition-colors"
                >
                  <h3 className="font-header font-bold text-[#1a120b] mb-2">Hair Care Tips</h3>
                  <p className="text-sm text-[#6a5a4a] font-body">Weekly hair care tips and tricks from our experts</p>
                </button>
              </div>
            )}

            {emailTab === "compose" && (
              <form onSubmit={handleSendEmail} className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Select Recipients</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="w-full border border-[#e8dfd3] px-4 py-3 text-left font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors flex items-center justify-between"
                    >
                      <span>{selectedUsers.length === 0 ? "Choose users..." : `${selectedUsers.length} user(s) selected`}</span>
                      <ChevronDown className="w-4 h-4 text-[#6a5a4a]" />
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#e8dfd3] shadow-lg max-h-64 overflow-y-auto">
                        {users.length === 0 ? (
                          <p className="p-4 text-sm text-[#8a7a6a]">No users available</p>
                        ) : (
                          users.map((user) => (
                            <label
                              key={user.id}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[#faf7f2] cursor-pointer border-b border-[#f0ebe5] last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.email)}
                                onChange={() => toggleUserSelection(user.email)}
                                className="w-4 h-4 text-[#533a00] border-[#e8dfd3] rounded focus:ring-[#533a00]"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-body text-[#1a120b]">{user.name || "User"}</p>
                                <p className="text-xs font-body text-[#8a7a6a]">{user.email}</p>
                              </div>
                              {selectedUsers.includes(user.email) && <Check className="w-4 h-4 text-[#533a00]" />}
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {selectedUsers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedUsers.map((email) => {
                        const user = users.find((u) => u.email === email);
                        return (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#faf7f2] border border-[#e8dfd3] text-xs font-body text-[#1a120b]"
                          >
                            {user?.name || email}
                            <button
                              type="button"
                              onClick={() => toggleUserSelection(email)}
                              className="text-[#6a5a4a] hover:text-[#533a00]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={10}
                    required
                    className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={sending || selectedUsers.length === 0}
                    className="px-8 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? "Sending..." : "Send Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailTab("templates")}
                    className="px-6 py-3.5 border border-[#e8dfd3] text-[#6a5a4a] text-xs uppercase tracking-wider font-semibold hover:bg-[#faf7f2] transition-colors"
                  >
                    Choose Template
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}