const express = require("express");
const route = express.Router();

const {
  getAllKhuyenmai,
  getKhuyenmaiById,
  addKhuyenmai,
  updateKhuyenmai,
  deleteKhuyenmai,
} = require("../controller/khuyenMaiController");

route.get("/", getAllKhuyenmai);
route.get("/:id", getKhuyenmaiById);
route.post("/", addKhuyenmai);
route.put("/", updateKhuyenmai);
route.delete("/:id", deleteKhuyenmai);
module.exports = route;
