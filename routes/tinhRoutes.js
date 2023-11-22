const express = require("express");
const route = express.Router();

const {
  getAllTinh,
  getTinhById,
  addTinh,
  updateTinh,
  deleteTinh,
} = require("../controller/tinhController");

route.get("/", getAllTinh);
route.get("/:id", getTinhById);
route.post("/", addTinh);
route.put("/", updateTinh);
route.delete("/:id", deleteTinh);
module.exports = route;
