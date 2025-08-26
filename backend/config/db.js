const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10, // tune based on workload
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

// Gracefully close pool on app termination
process.on("SIGINT", async () => {
  await pool.end();
  console.log("🔒 Database pool closed");
  process.exit(0);
});

module.exports = { pool, connectDB };
