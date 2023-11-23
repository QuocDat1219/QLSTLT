const express = require("express");
const route = express.Router();

const {
  getAllPhieunhap,
  getPhieunhapById,
  addPhieunhap,
  updatePhieunhap,
  deletePhieunhap,
} = require("../controller/phieuNhapCotroller");

route.get("/", getAllPhieunhap);
route.get("/:id", getPhieunhapById);
route.post("/", addPhieunhap);
route.put("/", updatePhieunhap);
route.delete("/:id", deletePhieunhap);
module.exports = route;
