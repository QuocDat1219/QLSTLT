const express = require("express");
const route = express.Router();

const {
  getAllCtdonhang,
  getCtdonhangById,
  addCtdonhang,
  updateCtdonhang,
  deleteCtdonhang,
  getCtdonhangByDeTail,
} = require("../controller/chiTietDonHangController");

route.get("/", getAllCtdonhang);
route.get("/details", getCtdonhangByDeTail);
route.get("/:id", getCtdonhangById);
route.post("/", addCtdonhang);
route.put("/", updateCtdonhang);
route.delete("/:id", deleteCtdonhang);
module.exports = route;
