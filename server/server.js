import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import "./utils/resetLoginAttempts.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("GET / called");
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("Could not start server:", error);
    process.exit(1);
  }
};

startServer();
