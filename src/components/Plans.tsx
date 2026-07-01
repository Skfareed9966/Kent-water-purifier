import React from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { HomePlan, WebsiteSettings } from "../types";

interface PlansProps {
  plans: HomePlan[];
  settings: WebsiteSettings;
}

export default function Plans({ plans, settings }: PlansProps) {
  const handleWhatsAppInquiry = (plan: HomePlan) => {
    const cleanNumber = settings.whatsappNumber.replace(/\D/g, "");
    
    const message = `Hello, I'm interested in this subscription plan.
Plan Name: ${plan.name}
Price: ${plan.price}
Plan Details: ${plan.description}

Please provide more details on registration and benefits.`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="plans" className="py-24 bg-transparent relative overflow-hidden">
      {/* Dynamic ambient vector shapes */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-blue-300/10 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-cyan-300/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50/80 border border-blue-200/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
          >
            Care Packages
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-4 tracking-tight"
          >
            Flexible Home Maintenance Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed"
          >
            Never worry about water safety again. Secure premium AMC (Annual Maintenance Contracts) for regular filter replacements, routine checkups, and free spare parts.
          </motion.p>
        </div>

        {/* Dynamic Subscription Plans Cards */}
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-white/30 backdrop-blur-md rounded-3xl border border-dashed border-white/50 shadow-lg">
            <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-slate-800 font-semibold text-lg">No Plans Available</h3>
            <p className="text-slate-500 text-sm mt-1">Please check back later or contact admin to add custom service plans.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => {
              // Highlight the middle one by default as a visual best-practice if we have 3
              const isPopular = index === 1;

              return (
                <motion.div
                  key={plan.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`backdrop-blur-lg rounded-3xl border hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden ${
                    isPopular
                      ? "bg-white/60 border-blue-500 ring-4 ring-blue-500/10 shadow-2xl relative lg:-translate-y-2 scale-[1.01]"
                      : "bg-white/40 border-white/60 shadow-lg hover:bg-white/50"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl z-10">
                      Best Value
                    </div>
                  )}

                  {/* Plan Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-display font-extrabold text-lg sm:text-xl drop-shadow-md">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    {/* Price Header */}
                    <div className="mb-6">
                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        ₹{plan.price}
                      </div>
                      <p className="text-slate-500 text-xs mt-1">Comprehensive AMC coverage</p>
                    </div>

                    {/* Plan Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {plan.description}
                    </p>

                    {/* Highlights bullet list */}
                    {plan.features && plan.features.length > 0 && (
                      <div className="space-y-3 mb-8 mt-auto">
                        {plan.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start space-x-3 text-slate-700 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* WhatsApp Action */}
                    <button
                      id={`btn-inquire-plan-${plan.id}`}
                      onClick={() => handleWhatsAppInquiry(plan)}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 border transition-all duration-200 cursor-pointer ${
                        isPopular
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent hover:shadow-lg active:scale-95"
                          : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Send className="h-4.5 w-4.5 shrink-0" />
                      <span>Enquire on WhatsApp</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
