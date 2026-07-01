import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = process.env.PORT||3000;
const DB_PATH = path.join(process.cwd(), "db.json");

app.use(express.json());

// Session Store for Admin Login
const ACTIVE_SESSIONS = new Map<string, { username: string; expiresAt: number }>();

// Initial Database Seeding
const defaultData = {
  admin: {
    username: "shaikmohammadfareed17@gmail.com",
    password: "Farru@1723"
  },
  settings: {
    businessName: "Kent Purifier",
    whatsappNumber: "918333873696",
    phone: "+91 8333873696",
    email: "contact@aquapuresolutions.com",
    address: "Plot 45, Water Works Colony, Sector 4, Hyderabad, India",
    mapsUrl: "https://maps.google.com/?q=Hyderabad",
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com"
    },
    heroTitle: "Pure & Healthy Water for Your Family",
    heroSubtitle: "Ensure 100% safe drinking water with our premium RO, UV, and Copper active multi-stage water purifiers.",
    heroBgImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1920",
    logoText: "Kent Purifier",
    bannerText: "Pure Water, Pure Life"
  },
  products: [
    {
      id: "prod_1",
      name: "AquaPure Premium RO + UV + Copper Active",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
      description: "Advanced 8-stage water purifier featuring mineral enhancement, active copper filter, and smart LED indicators for water quality.",
      price: "16,499",
      available: true,
      features: [
        "8-Stage Advanced Purification",
        "Active Copper & Mineral Booster",
        "9L Food-Grade Storage Tank",
        "TDS Controller & Modulator",
        "Smart LED Alerts for Filter Life"
      ]
    },
    {
      id: "prod_2",
      name: "AquaPure Eco RO+UV Water Purifier",
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800",
      description: "Efficient multi-stage purifier designed for households with water savings technology and high TDS tolerance.",
      price: "12,999",
      available: true,
      features: [
        "7-Stage RO + UV Protection",
        "Eco Water Saving Tech (saves 40%)",
        "8L UV-Protected Storage Tank",
        "Wall-Mountable Sleek Design",
        "1-Year Comprehensive Warranty"
      ]
    },
    {
      id: "prod_3",
      name: "AquaPure Ultra UF Gravity Purifier",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800",
      description: "Non-electric chemical-free gravity water purifier utilizing hollow-fiber UF membrane technology.",
      price: "3,499",
      available: true,
      features: [
        "Chemical-Free Gravity Purifier",
        "High-grade UF Membrane Filter",
        "15 Liters Total Storage Capacity",
        "No Electricity Required",
        "Shatterproof Food-Grade Body"
      ]
    }
  ],
  plans: [
    {
      id: "plan_1",
      name: "AquaCare Essential Plan",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
      description: "Perfect for budget-conscious families. Includes periodic maintenance and basic filter checks.",
      price: "2,499/year",
      features: [
        "2 Complimentary Maintenance Services",
        "Sediment & Carbon Filter Replacement",
        "Free Labor on Service Calls",
        "24-Hour Emergency Assistance"
      ]
    },
    {
      id: "plan_2",
      name: "AquaCare Shield Plan (RO+UV)",
      image: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&q=80&w=800",
      description: "Most popular choice. Complete protection including membrane changes and active copper service.",
      price: "4,499/year",
      features: [
        "4 Comprehensive Services",
        "Complete Filter Kit Replacement",
        "RO Membrane Replacement Covered",
        "Unlimited Breakdown Requests",
        "Same-Day Priority Support"
      ]
    },
    {
      id: "plan_3",
      name: "AquaCare Premium Commercial Plan",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      description: "Commercial water purification maintenance package for offices, clinics, and small institutions.",
      price: "9,999/year",
      features: [
        "Monthly Health Checks",
        "Complete Pre-Filter and Post-Filter Kits",
        "All Spares and Membranes Covered",
        "Dedicated Account Engineer",
        "Guaranteed 4-Hour Response Time"
      ]
    }
  ],
  appointments: [
    {
      id: "apt_1",
      name: "Ramesh Kumar",
      mobile: "9876543210",
      address: "Flat 402, Lotus Residency, Gachibowli, Hyderabad",
      date: "2026-07-02",
      time: "10:00 AM",
      service: "Installation",
      message: "Please call 30 mins before reaching the location.",
      status: "pending",
      createdAt: "2026-06-30T10:00:00.000Z"
    }
  ]
};

// Helper: Read DB
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, resetting to default:", err);
    return defaultData;
  }
}

// Helper: Write DB
function writeDb(data: typeof defaultData) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to db.json:", err);
  }
}

// Ensure database is initialized
readDb();

// Middleware: Authenticate Admin Session
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  const session = ACTIVE_SESSIONS.get(token);
  
  if (!session || Date.now() > session.expiresAt) {
    if (session) ACTIVE_SESSIONS.delete(token);
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  next();
}

// ==================== PUBLIC API ENDPOINTS ====================

// Get website contents, products, and subscription plans
app.get("/api/content", (req, res) => {
  const db = readDb();
  // Strip out admin credentials before sending to public client
  const { admin, ...publicData } = db;
  res.json(publicData);
});

// Create an appointment booking
app.post("/api/appointments", (req, res) => {
  const { name, mobile, address, date, time, service, message } = req.body;
  if (!name || !mobile || !address || !date || !time || !service) {
    return res.status(400).json({ error: "All fields except message are required" });
  }

  const db = readDb();
  const newApt = {
    id: "apt_" + crypto.randomUUID().replace(/-/g, "").substring(0, 8),
    name,
    mobile,
    address,
    date,
    time,
    service,
    message: message || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  db.appointments.unshift(newApt);
  writeDb(db);
  res.status(201).json({ success: true, appointment: newApt });
});

// ==================== ADMIN CORE API ENDPOINTS ====================

// Login endpoint
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDb();

  if (
    username === db.admin.username &&
    password === db.admin.password
  ) {
    const token = crypto.randomUUID().replace(/-/g, "");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiry
    ACTIVE_SESSIONS.set(token, { username, expiresAt });
    return res.json({ token, success: true });
  }

  res.status(401).json({ error: "Invalid username or password" });
});

// Admin check-session endpoint
app.get("/api/admin/check", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.split(" ")[1];
  const session = ACTIVE_SESSIONS.get(token);
  if (session && Date.now() < session.expiresAt) {
    return res.json({ authenticated: true });
  }
  res.json({ authenticated: false });
});

// Logout endpoint
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    ACTIVE_SESSIONS.delete(token);
  }
  res.json({ success: true });
});

// Change username and password
app.post("/api/admin/change-password", authenticateAdmin, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password cannot be empty" });
  }

  const db = readDb();
  db.admin.username = username;
  db.admin.password = password;
  writeDb(db);

  res.json({ success: true, message: "Credentials updated successfully" });
});

// Update website settings (contact details, banner, logo, hero section, etc)
app.put("/api/admin/settings", authenticateAdmin, (req, res) => {
  const newSettings = req.body;
  if (!newSettings || typeof newSettings !== "object") {
    return res.status(400).json({ error: "Invalid settings payload" });
  }

  const db = readDb();
  db.settings = { ...db.settings, ...newSettings };
  writeDb(db);

  res.json({ success: true, settings: db.settings });
});

// Add new product
app.post("/api/admin/products", authenticateAdmin, (req, res) => {
  const { name, image, description, price, available, features } = req.body;
  if (!name || !image || !description || !price) {
    return res.status(400).json({ error: "Product name, image, description, and price are required" });
  }

  const db = readDb();
  const newProd = {
    id: "prod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 8),
    name,
    image,
    description,
    price,
    available: available !== undefined ? available : true,
    features: Array.isArray(features) ? features : []
  };

  db.products.push(newProd);
  writeDb(db);

  res.status(201).json({ success: true, product: newProd });
});

// Edit existing product
app.put("/api/admin/products/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { name, image, description, price, available, features } = req.body;

  const db = readDb();
  const productIndex = db.products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  db.products[productIndex] = {
    ...db.products[productIndex],
    name: name || db.products[productIndex].name,
    image: image || db.products[productIndex].image,
    description: description || db.products[productIndex].description,
    price: price || db.products[productIndex].price,
    available: available !== undefined ? available : db.products[productIndex].available,
    features: Array.isArray(features) ? features : db.products[productIndex].features
  };

  writeDb(db);
  res.json({ success: true, product: db.products[productIndex] });
});

// Delete product
app.delete("/api/admin/products/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const filteredProducts = db.products.filter((p) => p.id !== id);

  if (filteredProducts.length === db.products.length) {
    return res.status(404).json({ error: "Product not found" });
  }

  db.products = filteredProducts;
  writeDb(db);
  res.json({ success: true, message: "Product deleted successfully" });
});

// Add home plan
app.post("/api/admin/plans", authenticateAdmin, (req, res) => {
  const { name, image, description, price, features } = req.body;
  if (!name || !image || !description || !price) {
    return res.status(400).json({ error: "Plan name, image, description, and price are required" });
  }

  const db = readDb();
  const newPlan = {
    id: "plan_" + crypto.randomUUID().replace(/-/g, "").substring(0, 8),
    name,
    image,
    description,
    price,
    features: Array.isArray(features) ? features : []
  };

  db.plans.push(newPlan);
  writeDb(db);

  res.status(201).json({ success: true, plan: newPlan });
});

// Edit existing home plan
app.put("/api/admin/plans/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { name, image, description, price, features } = req.body;

  const db = readDb();
  const planIndex = db.plans.findIndex((p) => p.id === id);

  if (planIndex === -1) {
    return res.status(404).json({ error: "Plan not found" });
  }

  db.plans[planIndex] = {
    ...db.plans[planIndex],
    name: name || db.plans[planIndex].name,
    image: image || db.plans[planIndex].image,
    description: description || db.plans[planIndex].description,
    price: price || db.plans[planIndex].price,
    features: Array.isArray(features) ? features : db.plans[planIndex].features
  };

  writeDb(db);
  res.json({ success: true, plan: db.plans[planIndex] });
});

// Delete home plan
app.delete("/api/admin/plans/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const filteredPlans = db.plans.filter((p) => p.id !== id);

  if (filteredPlans.length === db.plans.length) {
    return res.status(404).json({ error: "Plan not found" });
  }

  db.plans = filteredPlans;
  writeDb(db);
  res.json({ success: true, message: "Plan deleted successfully" });
});

// Retrieve all appointments
app.get("/api/admin/appointments", authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.appointments);
});

// Update appointment status (pending, completed, cancelled)
app.put("/api/admin/appointments/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid appointment status" });
  }

  const db = readDb();
  const aptIndex = db.appointments.findIndex((a) => a.id === id);

  if (aptIndex === -1) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  db.appointments[aptIndex].status = status;
  writeDb(db);
  res.json({ success: true, appointment: db.appointments[aptIndex] });
});

// Delete appointment
app.delete("/api/admin/appointments/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const filteredApts = db.appointments.filter((a) => a.id !== id);

  if (filteredApts.length === db.appointments.length) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  db.appointments = filteredApts;
  writeDb(db);
  res.json({ success: true, message: "Appointment deleted successfully" });
});

// ==================== VITE & STATIC FILES HANDLING ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode - Serve build static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
