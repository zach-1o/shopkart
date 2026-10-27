import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { MongoMemoryServer } from "mongodb-memory-server";

// Import routes
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import Product from "./models/product.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting single-domain or multi-domain deployments
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like same-origin static requests, Postman) or any origin in production
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "ShopKart API is running" });
});

// API Routes as specified across all labs
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Serve static frontend files in production (All-in-one deployment support)
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

app.get("*", (req, res, next) => {
  if (
    req.path.startsWith("/customers") ||
    req.path.startsWith("/products") ||
    req.path.startsWith("/wishlist") ||
    req.path.startsWith("/cart") ||
    req.path.startsWith("/orders") ||
    req.path.startsWith("/health")
  ) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
    if (err) {
      next();
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Seed sample products if database is empty
const seedInitialProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Seeding initial products into database...");
      await Product.insertMany([
        {
          name: "Noise Cancelling Headphones",
          description: "Wireless over-ear headphones with active noise cancellation and 30-hour battery life.",
          price: 4999,
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
          stock: 25
        },
        {
          name: "Mechanical Keyboard",
          description: "RGB mechanical gaming keyboard with responsive blue tactile switches.",
          price: 2999,
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
          stock: 12
        },
        {
          name: "Ergonomic Office Chair",
          description: "High-back mesh executive chair with dynamic lumbar support and adjustable armrests.",
          price: 8499,
          category: "Home",
          image: "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=600&auto=format&fit=crop&q=80",
          stock: 8
        },
        {
          name: "Classic Minimalist Watch",
          description: "Sleek stainless steel analog timepiece with sapphire crystal glass and leather strap.",
          price: 3499,
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
          stock: 15
        },
        {
          name: "Full-Stack Web Development Handbook",
          description: "Comprehensive guide to mastering the MERN stack with modern fullstack architecture patterns.",
          price: 999,
          category: "Books",
          image: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?w=600&auto=format&fit=crop&q=80",
          stock: 40
        },
        {
          name: "Smart Fitness Tracker",
          description: "Water-resistant smart band with 24/7 heart-rate monitoring, SpO2 sensor and AMOLED display.",
          price: 2199,
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80",
          stock: 18
        }
      ]);
      console.log("Initial sample products seeded successfully!");
    }
  } catch (err) {
    console.warn("Product seeding error:", err.message);
  }
};

import dns from "dns";

// Database connection with seamless in-memory fallback
const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/shopkart";
  try {
    if (uri.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
      } catch (dnsErr) {
        // Ignore if restricted
      }
    }
    console.log(`Connecting to MongoDB at: ${uri.replace(/:([^:@]+)@/, ":****@")}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.warn(`MongoDB primary connection error (${error.message}). Starting in-memory fallback...`);
    const mongoServer = await MongoMemoryServer.create();
    const fallbackUri = mongoServer.getUri();
    await mongoose.connect(fallbackUri);
    console.log(`Connected to in-memory MongoDB at: ${fallbackUri}`);
  }

  await seedInitialProducts();
};

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ShopKart Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
