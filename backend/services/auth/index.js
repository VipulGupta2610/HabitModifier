import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectdb } from "./config/db.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const port = process.env.PORT || 8001;
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Auth server is running successfully" });
});

// Connect DB then start server
connectdb().then(() => {
  app.listen(port, () => {
    console.log(`Auth Server is listening on port: ${port}`);
  });
});