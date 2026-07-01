import React from "react";
import { Shield, Phone, Mail, MapPin, CheckCircle2, MessageCircle } from "lucide-react";
import { WebsiteSettings } from "../types";
import { KentLogo } from "./KentLogo";

interface FooterProps {
  settings: WebsiteSettings;
  onAdminClick: () => void;
}

export default function Footer({ settings, onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950/80 backdrop-blur-md text-slate-400 pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              {settings.logoUrl ? (
                <div className="flex items-center space-x-2">
                  <img
                    src={settings.logoUrl}
                    alt={settings.businessName || "Logo"}
                    className="h-8 w-auto max-w-[140px] object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-display font-bold text-xl tracking-tight">
                    {settings.logoText || "Kent Purifier"}
                  </span>
                </div>
              ) : (
                <KentLogo size="sm" className="origin-left scale-90" />
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Leading the standard in high-performance domestic and commercial RO water purification systems. Pure Water, Healthy Family.
            </p>
            <div className="flex items-center space-x-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>WHO & ISO Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">Water Purifiers</a>
              </li>
              <li>
                <a href="#plans" className="hover:text-white transition-colors">Subscription Plans</a>
              </li>
              <li>
                <a href="#booking" className="hover:text-white transition-colors">Book Service Slot</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact Expert Support</a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">Customer Helpline</h4>
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <Phone className="h-4 w-4 text-blue-500 shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                +{settings.whatsappNumber}
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <Mail className="h-4 w-4 text-sky-500 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
            </div>
          </div>

          {/* Location details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">Headquarters</h4>
            <div className="flex items-start space-x-2 text-sm text-slate-300 leading-relaxed">
              <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Separator / Credit */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            &copy; {currentYear} {settings.businessName || "AquaPure Solutions"}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <button
              onClick={onAdminClick}
              className="hover:text-blue-500 transition-colors flex items-center space-x-1.5"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Portal</span>
            </button>
            <span className="text-slate-700">|</span>
            <span>Designed for Health and Safety</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
