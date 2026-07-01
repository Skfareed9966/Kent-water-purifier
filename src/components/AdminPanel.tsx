import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  LogOut,
  Settings,
  Grid,
  FileText,
  CalendarCheck,
  UserCheck,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  HelpCircle,
  Save,
  Loader2,
  Image as ImageIcon,
  Check,
  X,
  Phone,
  Eye,
  AlertCircle
} from "lucide-react";
import { WebsiteSettings, Product, HomePlan, Appointment, PublicContent } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  publicData: PublicContent;
  onRefreshData: () => void;
}

type TabType = "settings" | "products" | "plans" | "appointments" | "credentials";

export default function AdminPanel({ onClose, publicData, onRefreshData }: AdminPanelProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState("");

  // Tabs navigation
  const [activeTab, setActiveTab] = useState<TabType>("settings");

  // Local editable copies of data
  const [settings, setSettings] = useState<WebsiteSettings>(publicData.settings);
  const [products, setProducts] = useState<Product[]>(publicData.products);
  const [plans, setPlans] = useState<HomePlan[]>(publicData.plans);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Editing modals/form states
  const [actionLoading, setActionLoading] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Product addition state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    available: true,
    featuresInput: ""
  });

  // Product editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingProductFeatures, setEditingProductFeatures] = useState("");

  // Plan addition state
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    featuresInput: ""
  });

  // Plan editing state
  const [editingPlan, setEditingPlan] = useState<HomePlan | null>(null);
  const [editingPlanFeatures, setEditingPlanFeatures] = useState("");

  // Admin Account Change State
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Check auth session on load
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      checkTokenValidity(savedToken);
    }
  }, []);

  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const checkTokenValidity = async (tkn: string) => {
    try {
      const res = await fetch("/api/admin/check", {
        headers: { Authorization: `Bearer ${tkn}` }
      });
      const data = await res.json();
      if (data.authenticated) {
        setToken(tkn);
        setIsAuthenticated(true);
        fetchAppointments(tkn);
      } else {
        localStorage.removeItem("admin_token");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAppointments = async (tkn: string) => {
    try {
      const res = await fetch("/api/admin/appointments", {
        headers: { Authorization: `Bearer ${tkn}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        localStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        fetchAppointments(data.token);
        triggerToast("Login Successful! Welcome to Admin Dashboard.");
      } else {
        setAuthError(data.error || "Incorrect admin user or password.");
      }
    } catch (err) {
      setAuthError("Failed to communicate with server.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("admin_token");
    setToken("");
    setIsAuthenticated(false);
    onClose();
  };

  // Update Global Settings
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        triggerToast("Website content and settings saved successfully!");
        onRefreshData();
      } else {
        alert("Failed to save settings. Please verify login.");
      }
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setActionLoading(false);
    }
  };

  // Create Product Action
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const featuresArray = newProduct.featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    const payload = {
      name: newProduct.name,
      image: newProduct.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
      description: newProduct.description,
      price: newProduct.price,
      available: newProduct.available,
      features: featuresArray
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setProducts([...products, data.product]);
        setShowAddProduct(false);
        setNewProduct({
          name: "",
          image: "",
          description: "",
          price: "",
          available: true,
          featuresInput: ""
        });
        triggerToast("Product added successfully!");
        onRefreshData();
      } else {
        alert("Failed to create product.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Product Action
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setActionLoading(true);

    const featuresArray = editingProductFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    const payload = {
      ...editingProduct,
      features: featuresArray
    };

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(products.map((p) => (p.id === editingProduct.id ? data.product : p)));
        setEditingProduct(null);
        triggerToast("Product updated successfully!");
        onRefreshData();
      } else {
        alert("Failed to update product.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product Action
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        triggerToast("Product deleted successfully.");
        onRefreshData();
      } else {
        alert("Failed to delete product.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Create Subscription Plan
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const featuresArray = newPlan.featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    const payload = {
      name: newPlan.name,
      image: newPlan.image || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800",
      description: newPlan.description,
      price: newPlan.price,
      features: featuresArray
    };

    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPlans([...plans, data.plan]);
        setShowAddPlan(false);
        setNewPlan({
          name: "",
          image: "",
          description: "",
          price: "",
          featuresInput: ""
        });
        triggerToast("Plan created successfully!");
        onRefreshData();
      } else {
        alert("Failed to create plan.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Subscription Plan Action
  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setActionLoading(true);

    const featuresArray = editingPlanFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    const payload = {
      ...editingPlan,
      features: featuresArray
    };

    try {
      const res = await fetch(`/api/admin/plans/${editingPlan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPlans(plans.map((p) => (p.id === editingPlan.id ? data.plan : p)));
        setEditingPlan(null);
        triggerToast("Plan updated successfully!");
        onRefreshData();
      } else {
        alert("Failed to update plan.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Subscription Plan Action
  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this home subscription plan?")) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setPlans(plans.filter((p) => p.id !== id));
        triggerToast("Subscription plan deleted.");
        onRefreshData();
      } else {
        alert("Failed to delete plan.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Change Appointment Booking Status
  const handleUpdateAptStatus = async (id: string, status: "pending" | "completed" | "cancelled") => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const data = await res.json();
        setAppointments(appointments.map((a) => (a.id === id ? data.appointment : a)));
        triggerToast(`Appointment status updated to ${status}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Appointment Booking
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to archive/delete this booking?")) return;

    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setAppointments(appointments.filter((a) => a.id !== id));
        triggerToast("Appointment record deleted.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Change Credentials Action
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      alert("Fields cannot be empty!");
      return;
    }
    setActionLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });

      if (res.ok) {
        triggerToast("Admin Credentials Updated Successfully!");
        setNewUsername("");
        setNewPassword("");
      } else {
        alert("Failed to update credentials.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Render Login overlay if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/45 backdrop-blur-2xl rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-white/60"
        >
          <div className="text-center mb-6">
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-display font-extrabold text-slate-900">Admin Portal Login</h3>
            <p className="text-slate-500 text-xs mt-1">Provide credentials to manage website catalog and bookings</p>
          </div>

          {authError && (
            <div className="bg-rose-50/80 backdrop-blur-sm text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold mb-4 border border-rose-100 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/50 outline-none text-sm text-slate-800 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/50 outline-none text-sm text-slate-800 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 border border-white/60 text-slate-600 hover:bg-white/40 font-bold rounded-xl text-sm transition-colors cursor-pointer bg-white/20 backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-center text-slate-400 mt-6 leading-normal">
            Default credentials are set to <span className="font-semibold text-slate-500">username: admin</span> and <span className="font-semibold text-slate-500">password: adminpassword</span>. Please change them immediately after access.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[99] flex items-stretch md:p-6 lg:p-12 overflow-hidden">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl font-semibold flex items-center space-x-2.5 text-sm"
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-2xl w-full max-w-7xl mx-auto flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-white/60"
      >
        {/* Header Block */}
        <div className="bg-slate-950/85 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600/35 p-1.5 rounded-lg text-blue-400 border border-blue-500/20">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg">Admin Control Center</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Real-Time Business Administration</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="bg-slate-900/60 text-slate-300 hover:text-white hover:bg-rose-950/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Panels Layout */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          
          {/* Side Drawer Navigation */}
          <nav className="bg-white/20 backdrop-blur-xl w-full md:w-64 border-r border-white/40 p-4 shrink-0 flex md:flex-col space-y-0 md:space-y-1.5 space-x-2 md:space-x-0 overflow-x-auto md:overflow-x-visible">
            
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-grow md:flex-grow-0 flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-700 hover:bg-white/45"
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>Website Content</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex-grow md:flex-grow-0 flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "products"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-700 hover:bg-white/45"
              }`}
            >
              <Grid className="h-4.5 w-4.5" />
              <span>Products Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab("plans")}
              className={`flex-grow md:flex-grow-0 flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "plans"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-700 hover:bg-white/45"
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Home Plans</span>
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex-grow md:flex-grow-0 flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap cursor-pointer relative ${
                activeTab === "appointments"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-700 hover:bg-white/45"
              }`}
            >
              <CalendarCheck className="h-4.5 w-4.5" />
              <span>Appointments</span>
              {appointments.filter((a) => a.status === "pending").length > 0 && (
                <span className="absolute md:top-3 md:right-3 bg-rose-500 text-white text-[9px] h-4.5 px-1.5 flex items-center justify-center rounded-full font-bold ml-1.5 md:ml-0 shadow-sm animate-pulse">
                  {appointments.filter((a) => a.status === "pending").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("credentials")}
              className={`flex-grow md:flex-grow-0 flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "credentials"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-700 hover:bg-white/45"
              }`}
            >
              <UserCheck className="h-4.5 w-4.5" />
              <span>Admin Account</span>
            </button>

          </nav>

          {/* Active Panel View Body */}
          <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-slate-50/50">
            
            {/* TAB: WEBSITE SETTINGS */}
            {activeTab === "settings" && (
              <form onSubmit={handleUpdateSettings} className="space-y-6 max-w-4xl">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-display">Manage Homepage Content</h4>
                  <p className="text-slate-500 text-xs mt-1">Changes are live immediately upon clicking Save Changes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Business & Brand Details */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Company Branding</h5>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Logo Text</label>
                      <input
                        type="text"
                        value={settings.logoText}
                        onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Logo Image URL (Optional)</label>
                      <input
                        type="url"
                        value={settings.logoUrl || ""}
                        onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                        placeholder="e.g. https://images.unsplash.com/... or direct link"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Banner Accents Text</label>
                      <input
                        type="text"
                        value={settings.bannerText}
                        onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Channels */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Communication Numbers</h5>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">WhatsApp Inquiry Number</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="919876543210 (without +)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Helpline Phone</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Hero Landing Details */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Hero Section Settings</h5>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Headline Promotion Text</label>
                      <input
                        type="text"
                        value={settings.heroTitle}
                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subtitle Description</label>
                      <textarea
                        value={settings.heroSubtitle}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Hero Background Image URL (Unsplash/Any)</label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={settings.heroBgImage}
                          onChange={(e) => setSettings({ ...settings, heroBgImage: e.target.value })}
                          className="flex-grow px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // select a random premium clean water purifier background
                            const waterBg = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1920";
                            setSettings({ ...settings, heroBgImage: waterBg });
                          }}
                          className="px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location Settings */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Address & Map Direction Links</h5>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Business Address</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Google Maps Direct Link URL</label>
                      <input
                        type="url"
                        value={settings.mapsUrl}
                        onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Social Media Integrations</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Facebook URL</label>
                        <input
                          type="url"
                          value={settings.socialLinks?.facebook || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Instagram URL</label>
                        <input
                          type="url"
                          value={settings.socialLinks?.instagram || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Twitter/X URL</label>
                        <input
                          type="url"
                          value={settings.socialLinks?.twitter || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Youtube URL</label>
                        <input
                          type="url"
                          value={settings.socialLinks?.youtube || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4.5 w-4.5" />
                    )}
                    <span>Save Website Settings</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: PRODUCTS CATALOG */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-display">Manage Water Purifiers Catalog</h4>
                    <p className="text-slate-500 text-xs mt-1">Add, update specifications, pricing, and availability states.</p>
                  </div>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start shadow-md cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Purifier</span>
                  </button>
                </div>

                {/* Inline Addition Box */}
                {showAddProduct && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCreateProduct}
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4 max-w-3xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h5 className="font-bold text-slate-800 text-sm">Create New Product Listing</h5>
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Product Name *</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          placeholder="AquaPure Super RO"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Pricing (₹ value) *</label>
                        <input
                          type="text"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          placeholder="14,999"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL (Unsplash/direct url) *</label>
                        <input
                          type="url"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Brief Description *</label>
                        <textarea
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
                          rows={2}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Product Key Highlights (one per line)</label>
                        <textarea
                          value={newProduct.featuresInput}
                          onChange={(e) => setNewProduct({ ...newProduct, featuresInput: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none font-sans"
                          rows={3}
                          placeholder="8-Stage Active Purification&#10;Mineral Enhancer Technology&#10;Copper Active Filters"
                        />
                      </div>
                      <div className="flex items-center space-x-3 pt-2">
                        <input
                          type="checkbox"
                          id="new-prod-avail"
                          checked={newProduct.available}
                          onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <label htmlFor="new-prod-avail" className="text-sm font-semibold text-slate-700 select-none">
                          In Stock / Available for Order
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(false)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        <span>Publish Listing</span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Edit Product Modal Form */}
                {editingProduct && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleEditProduct}
                    className="bg-amber-50/50 p-6 rounded-2xl border-2 border-amber-300/60 shadow-md space-y-4 max-w-3xl"
                  >
                    <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                      <h5 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                        <Edit3 className="h-4.5 w-4.5 text-amber-600" />
                        <span>Edit Listing: {editingProduct.name}</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Product Name</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price (₹ value)</label>
                        <input
                          type="text"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                        <input
                          type="url"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                        <textarea
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white resize-none"
                          rows={2}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Features Highlights (one per line)</label>
                        <textarea
                          value={editingProductFeatures}
                          onChange={(e) => setEditingProductFeatures(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-3 pt-2">
                        <input
                          type="checkbox"
                          id="edit-prod-avail"
                          checked={editingProduct.available}
                          onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 bg-white"
                        />
                        <label htmlFor="edit-prod-avail" className="text-sm font-semibold text-slate-700">
                          In Stock / Available for Order
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        <span>Save Modifications</span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Products Grid in Admin Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col p-4 shadow-sm relative">
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-50 mb-3">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h5>
                      <span className="text-blue-600 text-xs font-bold mt-1">Price: ₹{product.price}</span>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-1.5">{product.description}</p>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          product.available ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          {product.available ? "In Stock" : "Out of Stock"}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setEditingProductFeatures(product.features ? product.features.join("\n") : "");
                            }}
                            className="text-slate-500 hover:text-amber-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PLANS */}
            {activeTab === "plans" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-display">Manage Maintenance Subscriptions</h4>
                    <p className="text-slate-500 text-xs mt-1">Configure AMC plans, terms, pricing schedules, and description lists.</p>
                  </div>
                  <button
                    onClick={() => setShowAddPlan(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start shadow-md cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Plan</span>
                  </button>
                </div>

                {/* Add Plan Form */}
                {showAddPlan && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCreatePlan}
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4 max-w-3xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h5 className="font-bold text-slate-800 text-sm">Create New Plan</h5>
                      <button
                        type="button"
                        onClick={() => setShowAddPlan(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Plan Name *</label>
                        <input
                          type="text"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          placeholder="AquaCare Platinum"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Pricing (e.g. ₹5,499/year) *</label>
                        <input
                          type="text"
                          value={newPlan.price}
                          onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          placeholder="4,999/year"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Banner Image URL *</label>
                        <input
                          type="url"
                          value={newPlan.image}
                          onChange={(e) => setNewPlan({ ...newPlan, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description Brief *</label>
                        <textarea
                          value={newPlan.description}
                          onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
                          rows={2}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Plan Bullet Features (one per line)</label>
                        <textarea
                          value={newPlan.featuresInput}
                          onChange={(e) => setNewPlan({ ...newPlan, featuresInput: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
                          rows={3}
                          placeholder="4 Complimentary Maintenance Inspections&#10;RO Membrane replacements covered&#10;Zero Service charge filter repairs"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPlan(false)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        <span>Publish Subscription</span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Edit Plan Modal Form */}
                {editingPlan && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleEditPlan}
                    className="bg-amber-50/50 p-6 rounded-2xl border-2 border-amber-300/60 shadow-md space-y-4 max-w-3xl"
                  >
                    <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                      <h5 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                        <Edit3 className="h-4.5 w-4.5 text-amber-600" />
                        <span>Edit Subscription: {editingPlan.name}</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => setEditingPlan(null)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Plan Name</label>
                        <input
                          type="text"
                          value={editingPlan.name}
                          onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Pricing (₹ value/year)</label>
                        <input
                          type="text"
                          value={editingPlan.price}
                          onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                        <input
                          type="url"
                          value={editingPlan.image}
                          onChange={(e) => setEditingPlan({ ...editingPlan, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                        <textarea
                          value={editingPlan.description}
                          onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white resize-none"
                          rows={2}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Features bullet Highlights (one per line)</label>
                        <textarea
                          value={editingPlanFeatures}
                          onChange={(e) => setEditingPlanFeatures(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white resize-none"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingPlan(null)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        <span>Save Modifications</span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Subscription lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {plans.map((plan) => (
                    <div key={plan.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col p-4 shadow-sm relative">
                      <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-50 mb-3">
                        <img src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{plan.name}</h5>
                      <span className="text-blue-600 text-xs font-bold mt-1">₹{plan.price}</span>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-1.5 leading-relaxed">{plan.description}</p>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setEditingPlan(plan);
                            setEditingPlanFeatures(plan.features ? plan.features.join("\n") : "");
                          }}
                          className="text-slate-500 hover:text-amber-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: APPOINTMENTS */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-display">Appointment Booking History</h4>
                  <p className="text-slate-500 text-xs mt-1">Review active queue requests, update service status and address directions.</p>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <CalendarCheck className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-slate-800 font-semibold text-base">No Bookings Found</h3>
                    <p className="text-slate-500 text-xs mt-1">Any appointment request raised on the main site will stack here.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">Customer Details</th>
                            <th className="p-4">Schedule Requested</th>
                            <th className="p-4">Service category</th>
                            <th className="p-4">Client Address & Note</th>
                            <th className="p-4">Queue State</th>
                            <th className="p-4 text-center">Manage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50/50">
                              <td className="p-4">
                                <div className="font-bold text-slate-900 text-sm">{apt.name}</div>
                                <div className="text-slate-500 font-mono mt-0.5">{apt.mobile}</div>
                              </td>
                              <td className="p-4 font-semibold text-slate-700">
                                <div className="text-slate-800">{apt.date}</div>
                                <div className="text-slate-500 text-[10px] mt-0.5">{apt.time}</div>
                              </td>
                              <td className="p-4 font-bold text-blue-600">
                                {apt.service}
                              </td>
                              <td className="p-4 max-w-xs">
                                <div className="text-slate-800 truncate" title={apt.address}>
                                  {apt.address}
                                </div>
                                {apt.message && (
                                  <div className="text-slate-400 font-light italic mt-1 line-clamp-1" title={apt.message}>
                                    "{apt.message}"
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                                  apt.status === "completed"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : apt.status === "cancelled"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-amber-50 text-amber-600"
                                }`}>
                                  {apt.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center space-x-1.5">
                                  {apt.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateAptStatus(apt.id, "completed")}
                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-1.5 rounded-lg font-bold"
                                        title="Mark Done"
                                      >
                                        <Check className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleUpdateAptStatus(apt.id, "cancelled")}
                                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg font-bold"
                                        title="Cancel Schedule"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleDeleteAppointment(apt.id)}
                                    className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
                                    title="Archive Record"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CHANGE CREDENTIALS */}
            {activeTab === "credentials" && (
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-display">Modify Portal Credentials</h4>
                  <p className="text-slate-500 text-xs mt-1">Update your login username and password to secure catalog access.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">New Username *</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. administrator"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-800 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">New Password *</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-800 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Account Credentials</span>
                </button>
              </form>
            )}

          </main>

        </div>
      </motion.div>
    </div>
  );
}
