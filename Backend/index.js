// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/AuthUser"); // Routes for authentication
const doctorData = require("./Routes/Doc_routes");
dotenv.config(); // Load environment variables from .env file

const app = express();

const port = process.env.PORT || 5000; // Set a default port if not specified

// Middleware
app.use(bodyParser.json()); // Parse JSON requests
app.use(cookieParser());
app.use(morgan("dev"));
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/doc", doctorData);
// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
