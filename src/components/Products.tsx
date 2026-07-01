import React from "react";
import { motion } from "motion/react";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { Product, WebsiteSettings } from "../types";

interface ProductsProps {
  products: Product[];
  settings: WebsiteSettings;
}

export default function Products({ products, settings }: ProductsProps) {
  const handleWhatsAppOrder = (product: Product) => {
    // Strip any spaces, dashes, or plus signs from the whatsapp number
    const cleanNumber = settings.whatsappNumber.replace(/\D/g, "");
    
    // Create the structured WhatsApp message template requested
    const message = `Hello, I'm interested in this product.
Product Name: ${product.name}
Price: ₹${product.price}
Product Link: ${window.location.origin}/#products

Please provide more details.`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;
    
    // Open in a new window/tab safely
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="products" className="py-24 bg-transparent relative overflow-hidden">
      {/* Design accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-300/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50/80 border border-blue-200/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
          >
            Our Catalog
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-4 tracking-tight"
          >
            Premium Water Purifiers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed"
          >
            Explore our state-of-the-art filtration solutions designed to eliminate heavy metals, chemicals, and bacteria while restoring vital alkaline minerals.
          </motion.p>
        </div>

        {/* Dynamic Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white/30 backdrop-blur-md rounded-3xl border border-dashed border-white/50 shadow-lg">
            <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-slate-800 font-semibold text-lg">No Products Available</h3>
            <p className="text-slate-500 text-sm mt-1">Please check back later or contact admin to add products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/40 backdrop-blur-lg rounded-3xl border border-white/60 hover:border-white/90 hover:bg-white/55 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-video bg-slate-100/50 w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Availability Badge */}
                  <span
                    className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm ${
                      product.available
                        ? "bg-emerald-500/90 text-white"
                        : "bg-rose-500/90 text-white"
                    }`}
                  >
                    {product.available ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Card Info Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Pricing Box */}
                  <div className="flex items-baseline space-x-1.5 mb-4">
                    <span className="text-2xl font-extrabold text-slate-900">₹{product.price}</span>
                    <span className="text-slate-500 text-xs font-medium">incl. taxes</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Bullet features */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-2 mb-6 mt-auto">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Highlights:</h4>
                      {product.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start space-x-2 text-slate-700 text-sm">
                          <Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WhatsApp Order Trigger */}
                  <button
                    id={`btn-order-prod-${product.id}`}
                    onClick={() => handleWhatsAppOrder(product)}
                    disabled={!product.available}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 border transition-all duration-200 cursor-pointer ${
                      product.available
                        ? "bg-[#25D366] text-white border-transparent hover:bg-[#20ba56] hover:shadow-lg active:scale-95"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5 shrink-0" />
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
