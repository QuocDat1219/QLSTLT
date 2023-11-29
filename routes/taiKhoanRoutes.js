const express = require("express");
const route = express.Router();

const {
  getAllTaikhoan,
  getTaikhoanById,
  addTaikhoan,
  updateTaikhoan,
  deleteTaikhoan,
} = require("../controller/taiKhoanController");

route.get("/", getAllTaikhoan);
route.get("/:id", getTaikhoanById);
route.post("/", addTaikhoan);
route.put("/", updateTaikhoan);
route.delete("/:TenTK", deleteTaikhoan);
module.exports = route;
