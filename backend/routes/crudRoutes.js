const express = require("express");
const { getAllData, createData, getSingleData, updateData, deleteData } = require("../controllers/crudController");

const router = express.Router();

router.route("/")
  .get(getAllData)
  .post(createData);

router.route("/:id")
  .get(getSingleData)
  .put(updateData)
  .delete(deleteData);

module.exports = router;
