import React from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight, ShieldAlert } from "lucide-react";
import { WebsiteSettings } from "../types";

interface HeroProps {
  settings: WebsiteSettings;
  onBookClick: () => void;
}

export default function Hero({ settings, onBookClick }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          id="hero-bg-image"
          src={settings.heroBgImage}
          alt="Clean Water Safe Drinking"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Frosted glass white-cyan gradient overlay for premium legibility and aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/60 to-cyan-50/70 backdrop-blur-[4px]" />
      </div>

      {/* Floating Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-200/30 rounded-full blur-[80px] animate-pulse pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-slate-800 w-full">
        <div className="max-w-3xl">
          {/* Subtle Banner Accent */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/50 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-sm shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
              {settings.bannerText || "Pure Water, Pure Life"}
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900"
          >
            {settings.heroTitle}
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            id="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-normal"
          >
            {settings.heroSubtitle}
          </motion.p>

          {/* Call-to-Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4"
          >
            <button
              id="hero-btn-book"
              onClick={onBookClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer group"
            >
              <Calendar className="h-5 w-5" />
              <span>Book Appointment</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </button>

            <a
              id="hero-whatsapp"
              href={`https://wa.me/${settings.whatsappNumber || "918333873696"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2.5"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.435 0 9.85-4.414 9.853-9.855.002-2.636-1.02-5.115-2.88-6.975C16.48 1.91 14.007.887 11.375.887 5.938.887 1.524 5.301 1.521 10.74c-.001 1.7.443 3.359 1.288 4.814l-.993 3.626 3.718-.975c1.445.789 2.972 1.203 4.513 1.205H12c.005 0 0 0 0 0zm8.252-6.59c-.31-.154-1.834-.905-2.119-1.01-.285-.104-.492-.154-.7.155-.207.31-.802 1.01-.984 1.217-.182.208-.364.23-.674.077-.31-.155-1.307-.482-2.49-1.538-.919-.82-1.54-1.832-1.72-2.14-.182-.309-.02-.477.135-.631.14-.139.31-.361.466-.543.156-.181.207-.31.31-.517.104-.207.052-.387-.026-.542-.078-.155-.7-.1.906-.958-1.129-.247-.282-.52-.384-.712-.31-.077-.104-.207-.156-.518-.052-.31.104-.464.31-.464.673 0 .362.155.725.337 1.139.182.414.337.8.57 1.113.466.62.9 1.139 1.42 1.63 1.166 1.114 2.14 1.781 3.287 2.22 1.147.439 2.193.387 2.993.267.89-.133 1.834-.75 2.093-1.439.26-.689.26-1.277.181-1.396-.077-.12-.284-.197-.595-.351z"/>
              </svg>
              <span>WhatsApp ({settings.phone || "8333873696"})</span>
            </a>

            <a
              id="hero-link-products"
              href="#products"
              className="bg-white/40 hover:bg-white/60 border border-white/60 text-slate-800 px-7 py-4 rounded-2xl font-bold backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>View Products</span>
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8 pt-8 border-t border-slate-200/60"
          >
            <div>
              <div className="text-3xl font-extrabold font-display text-blue-600">99.9%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Purity Level</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-display text-blue-600">10k+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Happy Homes</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-3xl font-extrabold font-display text-blue-600">24/7</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Active Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
