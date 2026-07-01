import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarRange, Sparkles, CheckCircle, Loader2, Phone, MapPin, CalendarDays, Clock, Settings2 } from "lucide-react";
import { WebsiteSettings } from "../types";

interface BookingFormProps {
  settings: WebsiteSettings;
  onSuccess?: () => void;
}

export default function BookingForm({ settings, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    date: "",
    time: "",
    service: "Regular Service & Maintenance",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const services = [
    "Regular Service & Maintenance",
    "New Purifier Installation",
    "Filter & Membrane Replacement",
    "Water Quality/TDS Testing",
    "Purifier Repair & Troubleshooting",
    "AMC Subscription Consultation"
  ];

  const timeSlots = [
    "09:00 AM - 11:00 AM (Morning)",
    "11:00 AM - 01:00 PM (Midday)",
    "01:00 PM - 03:00 PM (Early Afternoon)",
    "03:00 PM - 05:00 PM (Late Afternoon)",
    "05:00 PM - 07:00 PM (Evening)"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    // Simple validation
    if (!formData.name || !formData.mobile || !formData.address || !formData.date || !formData.time || !formData.service) {
      setErrorMsg("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        setFormData({
          name: "",
          mobile: "",
          address: "",
          date: "",
          time: "",
          service: "Regular Service & Maintenance",
          message: ""
        });
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Failed to submit booking. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setStatus("error");
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-transparent relative overflow-hidden">
      {/* Design background decorative elements */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-300/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Promotional / Info Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600/90 to-blue-800/95 backdrop-blur-md p-8 sm:p-10 text-white flex flex-col justify-between border-r border-white/20">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold mb-6">
                <Sparkles className="h-3.5 w-3.5 text-blue-200 animate-pulse" />
                <span className="text-blue-50">Same-Day Service Available</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight mb-4">
                Book a Professional Technician
              </h3>
              <p className="text-blue-100/90 text-sm leading-relaxed mb-8">
                Get your water purifier inspected by certified experts. We service all brands with genuine spares and guaranteed water safety parameters.
              </p>

              {/* Service Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm font-semibold">
                  <div className="bg-white/15 p-2 rounded-xl text-blue-200 shrink-0 border border-white/10">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>100% Certified Spares</span>
                </div>
                <div className="flex items-center space-x-3 text-sm font-semibold">
                  <div className="bg-white/15 p-2 rounded-xl text-blue-200 shrink-0 border border-white/10">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Free Water Quality Test</span>
                </div>
                <div className="flex items-center space-x-3 text-sm font-semibold">
                  <div className="bg-white/15 p-2 rounded-xl text-blue-200 shrink-0 border border-white/10">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Transparent Pricing</span>
                </div>
              </div>
            </div>

            {/* Helpline bottom note */}
            <div className="mt-12 pt-6 border-t border-white/10 text-xs text-blue-100/70">
              Need immediate help? Call us directly: <br />
              <span className="text-white font-extrabold text-base tracking-wide block mt-1">{settings.phone}</span>
            </div>
          </div>

          {/* Form Content Column */}
          <div className="lg:col-span-7 p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 flex flex-col items-center justify-center h-full"
                >
                  <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-md shadow-emerald-100/50">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, your appointment has been recorded. Our support executive will reach out to you shortly to confirm the technician schedule.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 text-sm font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    Schedule another service
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="booking-inputs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="mb-2">
                    <h4 className="text-xl font-display font-extrabold text-slate-900">Request Appointment</h4>
                    <p className="text-slate-500 text-xs mt-1">Please provide details to configure your service queue.</p>
                  </div>

                  {errorMsg && (
                    <div className="bg-rose-50/80 backdrop-blur-sm text-rose-600 px-4 py-3 rounded-xl text-xs font-semibold border border-rose-100">
                      {errorMsg}
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ramesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1.5">
                      <label htmlFor="mobile" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">+91</span>
                        <input
                          id="mobile"
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="service" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Service Required *
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all bg-white/50 backdrop-blur-sm appearance-none"
                        required
                      >
                        {services.map((svc) => (
                          <option key={svc} value={svc}>
                            {svc}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <Settings2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Preferred Date */}
                    <div className="space-y-1.5">
                      <label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Preferred Date *
                      </label>
                      <input
                        id="date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>

                    {/* Preferred Time */}
                    <div className="space-y-1.5">
                      <label htmlFor="time" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <select
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all bg-white/50 backdrop-blur-sm appearance-none"
                          required
                        >
                          <option value="">Select Time Slot</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Installation Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Service Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Flat No, Apartment, Street name, Locality"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Specify your purifier brand, issues faced, or direct landmarks..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all bg-white/50 backdrop-blur-sm resize-none"
                    />
                  </div>

                  {/* Submit Trigger */}
                  <button
                    id="btn-submit-booking"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/10 hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Reserving Slot...</span>
                      </>
                    ) : (
                      <>
                        <CalendarRange className="h-5 w-5" />
                        <span>Confirm Service Schedule</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
