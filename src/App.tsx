import React, { useState, useEffect } from "react";
import { ShieldCheck, Phone, CheckCircle, RefreshCw, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PublicContent, WebsiteSettings, Product, HomePlan } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Plans from "./components/Plans";
import BookingForm from "./components/BookingForm";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [data, setData] = useState<PublicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modals / Interactivity
  const [showAdmin, setShowAdmin] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch all public details (settings, products, plans) on load
  const fetchData = async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) {
        throw new Error("Failed to load website configuration");
      }
      const json: PublicContent = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while connecting to database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          {/* Animated Water Drop / Shield */}
          <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-blue-500/20 rounded-full animate-pulse" />
            <div className="relative h-16 w-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <ShieldCheck className="h-9 w-9 text-white animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-2xl tracking-tight text-white">AquaPure Solutions</h3>
            <p className="text-slate-400 text-sm font-light">Loading premium safe drinking water catalog...</p>
          </div>

          <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-blue-500 w-1/2 rounded-full animate-[shimmer_1.5s_infinite_linear]" style={{
              backgroundImage: 'linear-gradient(to right, #3b82f6, #60a5fa, #3b82f6)',
              backgroundSize: '200% 100%'
            }} />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-5">
          <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <ChevronUp className="h-6 w-6 rotate-180" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Failed to Connect</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            {error || "Could not retrieve water purifier configurations. Please ensure the server is fully started."}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const { settings, products, plans } = data;

  return (
    <div id="site-root" className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-cyan-100 text-slate-800 relative overflow-x-hidden">
      {/* Ambient background visual accents */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-300/25 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-5 w-[450px] h-[450px] bg-blue-200/25 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-300/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      {/* Website Header & Navigation */}
      <Navbar
        settings={settings}
        onBookClick={() => scrollToSection("booking")}
        onAdminClick={() => setShowAdmin(true)}
      />

      {/* Main sections sequence */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <Hero
          settings={settings}
          onBookClick={() => scrollToSection("booking")}
        />

        {/* Dynamic Water Purifiers Grid Catalog */}
        <Products
          products={products}
          settings={settings}
        />

        {/* Flexible Subscription Packages */}
        <Plans
          plans={plans}
          settings={settings}
        />

        {/* Technician Slot Booking Form */}
        <BookingForm
          settings={settings}
        />

        {/* Map, Directions, Telephone list */}
        <Contact
          settings={settings}
        />

      </main>

      {/* Full layout footer */}
      <Footer
        settings={settings}
        onAdminClick={() => setShowAdmin(true)}
      />

      {/* ADMIN CONTROL PANEL DASHBOARD MODAL */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel
            onClose={() => setShowAdmin(false)}
            publicData={data}
            onRefreshData={fetchData}
          />
        )}
      </AnimatePresence>

      {/* FLOATING ACTION WIDGETS */}
      
      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-2xl hover:shadow-blue-500/20 hover:scale-105 active:scale-95 cursor-pointer transition-all border border-blue-500"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Speed Dial WhatsApp Call widget */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col space-y-3">
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba56] text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-emerald-400/20"
          title="Chat on WhatsApp"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.276 3.508 8.48-.003 6.66-5.338 11.999-11.95 11.999-2.005-.002-3.975-.494-5.741-1.429L0 24zm6.05-4.839l.325.193c1.724 1.024 3.705 1.563 5.732 1.564 5.704 0 10.346-4.64 10.349-10.343.002-2.762-1.071-5.358-3.023-7.312-1.954-1.953-4.551-3.028-7.319-3.028-5.71 0-10.352 4.642-10.355 10.347-.001 2.016.528 3.99 1.538 5.717l.213.364-1.002 3.658 3.743-.982zm11.362-6.804c-.314-.157-1.858-.917-2.143-1.02-.284-.102-.49-.153-.696.157-.206.311-.798 1.02-.977 1.225-.179.204-.359.229-.673.072-1.29-.646-2.162-1.127-2.92-2.428-.198-.34.198-.316.567-1.053.061-.122.03-.229-.015-.314-.045-.085-.49-1.18-.671-1.615-.176-.425-.371-.366-.509-.373-.13-.006-.28-.008-.43-.008-.15 0-.394.056-.6.282-.206.226-.787.77-1.069 1.866-.282 1.1-.818 2.16-1.1 2.538-.282.378-1.558 2.378-3.774 3.342-.527.23-1.01.378-1.353.487-.529.168-1.011.144-1.393.087-.425-.063-1.314-.538-1.5-.105-.187-.562-.187-1.042-.187-1.096-.187-.054-.36-.082-.674-.239z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
