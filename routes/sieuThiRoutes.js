const express = require("express");
const route = express.Router();

const {
  getAllSieuthi,
  getSieuthiById,
  addSieuthi,
  updateSieuthi,
  deleteSieuthi,
} = require("../controller/sieuThiController");

route.get("/", getAllSieuthi);
route.get("/:id", getSieuthiById);
route.post("/", addSieuthi);
route.put("/", updateSieuthi);
route.delete("/:id", deleteSieuthi);
module.exports = route;
