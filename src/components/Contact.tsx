import React from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, MessageSquare, Clock, Globe, Facebook, Instagram, Twitter, Youtube, ExternalLink } from "lucide-react";
import { WebsiteSettings } from "../types";

interface ContactProps {
  settings: WebsiteSettings;
}

export default function Contact({ settings }: ContactProps) {
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent("Hello! I want to inquire about your water purifiers and home services.")}`;

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: settings.socialLinks?.facebook, color: "hover:bg-blue-600 hover:text-white" },
    { name: "Instagram", icon: Instagram, url: settings.socialLinks?.instagram, color: "hover:bg-pink-600 hover:text-white" },
    { name: "Twitter", icon: Twitter, url: settings.socialLinks?.twitter, color: "hover:bg-sky-500 hover:text-white" },
    { name: "Youtube", icon: Youtube, url: settings.socialLinks?.youtube, color: "hover:bg-rose-600 hover:text-white" }
  ];

  return (
    <section id="contact" className="py-24 bg-transparent relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-cyan-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50/80 border border-blue-200/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-4 tracking-tight">
            Contact Our Expert Team
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Have questions about water purification or need emergency repair service? Reach out to our 24/7 dedicated helpline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Info Cards Column */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Call support */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-3xl flex items-start space-x-4 hover:shadow-xl hover:bg-white/55 transition-all duration-300 shadow-lg"
            >
              <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl shrink-0 border border-blue-100">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Direct Support Phone</h4>
                <a href={`tel:${settings.phone}`} className="text-lg font-extrabold text-blue-600 hover:underline">
                  {settings.phone}
                </a>
                <p className="text-slate-500 text-xs mt-1">Available 08:00 AM - 08:00 PM everyday</p>
              </div>
            </motion.div>

            {/* WhatsApp chat */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-3xl flex items-start space-x-4 hover:shadow-xl hover:bg-white/55 transition-all duration-300 shadow-lg"
            >
              <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl shrink-0 border border-emerald-100">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Instant WhatsApp Support</h4>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-extrabold text-emerald-600 hover:underline flex items-center space-x-1"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-slate-500 text-xs mt-1">Direct support and live product consultation</p>
              </div>
            </motion.div>

            {/* Email Address */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-3xl flex items-start space-x-4 hover:shadow-xl hover:bg-white/55 transition-all duration-300 shadow-lg"
            >
              <div className="bg-sky-50 text-sky-600 p-3.5 rounded-2xl shrink-0 border border-sky-100">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Official Email Address</h4>
                <a href={`mailto:${settings.email}`} className="text-lg font-extrabold text-slate-800 hover:text-blue-600">
                  {settings.email}
                </a>
                <p className="text-slate-500 text-xs mt-1">Expected reply time: within 2 hours</p>
              </div>
            </motion.div>

            {/* Headquarters Address */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-3xl flex items-start space-x-4 hover:shadow-xl hover:bg-white/55 transition-all duration-300 shadow-lg"
            >
              <div className="bg-amber-50 text-amber-600 p-3.5 rounded-2xl shrink-0 border border-amber-100">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Corporate Headquarters</h4>
                <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                  {settings.address}
                </p>
              </div>
            </motion.div>

            {/* Social Media Link Box */}
            <div className="pt-6 border-t border-slate-200/55">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Connect with us on socials</h5>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => {
                  if (!social.url) return null;
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-11 w-11 rounded-full border border-white/60 bg-white/30 backdrop-blur-md text-slate-600 flex items-center justify-center transition-all duration-300 shadow-sm ${social.color}`}
                      title={social.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Google Maps / Embed Area */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-white/40 backdrop-blur-lg rounded-[32px] overflow-hidden border border-white/60 shadow-xl h-full min-h-[350px] relative">
              <iframe
                title="Business Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.7579738092283!2d78.38459427516335!3d17.433433583460677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93edee555555%3A0x6a1d46b76cd970d!2sGachibowli%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1703950000000!5m2!1sen!2sin"
                className="w-full h-full min-h-[350px] border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Overlapping Maps Control Badge */}
              <div className="absolute bottom-4 left-4 bg-white/75 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/50 max-w-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 block">Google Maps Location</span>
                <span className="text-xs text-slate-800 font-bold block mt-0.5 truncate">{settings.businessName || "AquaPure Solutions"}</span>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 font-bold hover:underline flex items-center space-x-1 mt-1.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
