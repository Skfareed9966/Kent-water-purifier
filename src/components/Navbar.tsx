import React, { useState, useEffect } from "react";
import { Menu, X, Phone, ShieldCheck } from "lucide-react";
import { WebsiteSettings } from "../types";
import { KentLogo } from "./KentLogo";

interface NavbarProps {
  settings: WebsiteSettings;
  onBookClick: () => void;
  onAdminClick: () => void;
}

export default function Navbar({ settings, onBookClick, onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Plans", href: "#plans" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/35 backdrop-blur-xl shadow-lg shadow-blue-500/5 border-b border-white/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            id="nav-logo"
            href="#home"
            className="flex items-center space-x-2 text-blue-600 transition-transform hover:scale-105"
          >
            {settings.logoUrl ? (
              <div className="flex items-center space-x-2">
                <img
                  src={settings.logoUrl}
                  alt={settings.businessName || "Logo"}
                  className="h-9 w-auto max-w-[150px] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                  {settings.logoText || "Kent Purifier"}
                </span>
              </div>
            ) : (
              <KentLogo size="sm" className="scale-90 origin-left" />
            )}
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm transition-colors duration-200 hover:text-blue-600 ${
                  isScrolled ? "text-slate-700" : "text-slate-800 md:text-slate-900"
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onAdminClick}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors"
            >
              Admin Panel
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              id="header-phone"
              href={`tel:${settings.phone}`}
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors text-sm font-semibold"
            >
              <Phone className="h-4 w-4 text-blue-600" />
              <span>{settings.phone}</span>
            </a>
            <button
              id="header-cta-book"
              onClick={onBookClick}
              className="bg-blue-600/90 hover:bg-blue-600 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/10 border border-blue-400/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={onBookClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors"
            >
              Book
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 p-1.5 hover:bg-white/40 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div id="mobile-drawer" className="md:hidden bg-white/75 backdrop-blur-xl border-t border-white/40 shadow-xl animate-fade-in">
          <div className="px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-blue-500/10 hover:text-blue-700 transition-all"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                onAdminClick();
              }}
              className="block w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-slate-600 hover:bg-blue-500/10 hover:text-blue-700 transition-all"
            >
              Admin Panel
            </button>
            <div className="pt-4 border-t border-slate-200/50 flex flex-col space-y-3 px-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center space-x-2 text-slate-800 hover:text-blue-600 text-sm font-semibold"
              >
                <Phone className="h-4 w-4 text-blue-600" />
                <span>{settings.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
