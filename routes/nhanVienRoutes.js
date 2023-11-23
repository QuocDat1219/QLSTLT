const express = require("express");
const route = express.Router();

const {
  getAllNhanvien,
  getNhanvienById,
  addNhanvien,
  updateNhanvien,
  deleteNhanvien,
} = require("../controller/nhanVienController");

route.get("/", getAllNhanvien);
route.get("/:id", getNhanvienById);
route.post("/", addNhanvien);
route.put("/", updateNhanvien);
route.delete("/:id", deleteNhanvien);
module.exports = route;
