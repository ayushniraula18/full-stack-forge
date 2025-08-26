const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const { connectDB } = require("./config/db");
const crudRoutes = require("./routes/crudRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/crud", crudRoutes);


const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
