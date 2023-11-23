const express = require("express");
const route = express.Router();

const {
  getAllCtPhieunhapkho,
  getCtPhieunhapkhoById,
  addCtPhieunhapkho,
  updateCtPhieunhapkho,
  deleteCtPhieunhapkho,
  getCtPhieunhapkhoByDetail,
} = require("../controller/cTPhieuNhapController");

route.get("/", getAllCtPhieunhapkho);
route.get("/details", getCtPhieunhapkhoByDetail);
route.get("/:id", getCtPhieunhapkhoById);
route.post("/", addCtPhieunhapkho);
route.put("/", updateCtPhieunhapkho);
route.delete("/:id", deleteCtPhieunhapkho);
module.exports = route;
