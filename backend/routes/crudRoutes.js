const express = require("express");
const { getAllData, createData, getSingleData, updateData, deleteData } = require("../controllers/crudController");
const { validateToken } = require("../middleware/validateTokenHandler");

const router = express.Router();

router.route("/")
  .get(validateToken, getAllData)
  .post(validateToken, createData);

router.route("/:id")
  .get(validateToken, getSingleData)
  .put(validateToken, updateData)
  .delete(validateToken, deleteData);

module.exports = router;
