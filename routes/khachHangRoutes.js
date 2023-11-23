const express = require("express");
const route = express.Router();

const {
  getAllKhachhang,
  getKhachhangById,
  addKhachhang,
  updateKhachhang,
  deleteKhachhang,
} = require("../controller/khachHangController");

route.get("/", getAllKhachhang);
route.get("/:id", getKhachhangById);
route.post("/", addKhachhang);
route.put("/", updateKhachhang);
route.delete("/:id", deleteKhachhang);
module.exports = route;
