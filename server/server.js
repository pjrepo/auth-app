// Import core dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import MongoDB connection function
import connectDB from "./config/db.js";

// Import authentication routes
import authRoutes from "./routes/authRoutes.js";

// Import and schedule cron job to reset login attempts
import "./utils/resetLoginAttempts.js";

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing (for frontend/backend communication)
app.use(cors());

/* ============================================
   Default GET route for root URL (health check)
============================================ */
app.get("/", (req, res) => {
  res.send(
    "Hi there! I'm the backend server of Authentication app deployed on render😉"
  );
});

/* ============================================
   Authentication API routes
   Base route: /api/auth
============================================ */
app.use("/api/auth", authRoutes);

/* ============================================
   Start the server after DB connection
============================================ */
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("Could not start server:", error);
    process.exit(1); // Exit with failure
  }
};

// Invoke the server starter
startServer();
