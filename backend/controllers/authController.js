const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tableName = "users"; // your users table
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Utility for standard responses
const sendResponse = (res, status, success, dataOrMessage) => {
  res.status(status).json(success ? { success, data: dataOrMessage } : { success, message: dataOrMessage });
};

// REGISTER
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendResponse(res, 400, false, "All fields are required");

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if user exists
    const [existing] = await connection.query(`SELECT * FROM ${tableName} WHERE username = ?`, [username]);
    if (existing.length > 0) return sendResponse(res, 409, false, "User already exists");

    // Hash password and insert
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      `INSERT INTO ${tableName} (username, password) VALUES (?, ?)`,
      [username, hashedPassword]
    );

    sendResponse(res, 201, true, { id: result.insertId, username });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  } finally {
    connection?.release();
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendResponse(res, 400, false, "All fields are required");

  let connection;
  try {
    connection = await pool.getConnection();

    const [users] = await connection.query(`SELECT * FROM ${tableName} WHERE username = ?`, [username]);
    if (users.length === 0) return sendResponse(res, 401, false, "Invalid credentials");

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendResponse(res, 401, false, "Invalid credentials");

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    sendResponse(res, 200, true, { token });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  } finally {
    connection?.release();
  }
};

// LOGOUT (client-side JWT invalidation)
const logoutUser = async (req, res) => {
  sendResponse(res, 200, true, "Logout successful (delete token on client)");
};

module.exports = { registerUser, loginUser, logoutUser };
