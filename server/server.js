import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import favicon from "serve-favicon";
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listing.js";
import bookingRoutes from "./routes/booking.js";
import userRoutes from "./routes/user.js";

// Initialize __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const faviconPath = path.join(__dirname, "public", "favicon.ico");
app.use(favicon(faviconPath));

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/auth", authRoutes);
app.use("/listing", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route to serve index.html for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// MongoDB connection
const PORT = process.env.PORT || 4000;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};
connectDB();

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server started on port ${PORT}`);
    console.log(`Access the server at your deployment URL.`);
  } else {
    console.log("Error: " + err);
  }
});
