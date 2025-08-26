const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const { connectDB } = require("./config/db");
const crudRoutes = require("./routes/crudRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/crud", crudRoutes);
app.use("/api/auth", authRoutes)


const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
