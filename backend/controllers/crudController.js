const { pool } = require("../config/db");

// Table name
const tableName = "demo_table1";

// Utility for standard responses
const sendResponse = (res, status, success, dataOrMessage) => {
  res.status(status).json(success ? { success, data: dataOrMessage } : { success, message: dataOrMessage });
};

// GET all records
const getAllData = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
    sendResponse(res, 200, true, rows);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  } finally {
    connection?.release();
  }
};

// GET single record by ID
const getSingleData = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    if (rows.length === 0) return sendResponse(res, 404, false, "Record not found");
    sendResponse(res, 200, true, rows[0]);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  } finally {
    connection?.release();
  }
};

// CREATE a new record
const createData = async (req, res) => {
  const { name, contact, address, gender } = req.body;
  if (!name || !contact || !address || !gender)
    return sendResponse(res, 400, false, "All fields are required");

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO ${tableName} (name, contact, address, gender) VALUES (?, ?, ?, ?)`,
      [name, contact, address, gender]
    );
    sendResponse(res, 201, true, { id: result.insertId, name, contact, address, gender });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  } finally {
    connection?.release();
  }
};

// UPDATE a record by ID
const updateData = async (req, res) => {
  const { id } = req.params;
  const { name, contact, address, gender } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    if (rows.length === 0) return sendResponse(res, 404, false, "Record not found");

    await connection.query(
      `UPDATE ${tableName} SET name = ?, contact = ?, address = ?, gender = ? WHERE id = ?`,
      [
        name || rows[0].name,
        contact || rows[0].contact,
        address || rows[0].address,
        gender || rows[0].gender,
        id,
      ]
    );
    sendResponse(res, 200, true, "Record updated successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  } finally {
    connection?.release();
  }
};

// DELETE a record by ID
const deleteData = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    if (rows.length === 0) return sendResponse(res, 404, false, "Record not found");

    await connection.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    sendResponse(res, 200, true, "Record deleted successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  } finally {
    connection?.release();
  }
};

module.exports = { getAllData, getSingleData, createData, updateData, deleteData };
