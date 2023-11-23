const express = require("express");
const route = express.Router();

const {
  getAllHanghoa,
  getHanghoaById,
  addHanghoa,
  updateHanghoa,
  deleteHanghoa,
} = require("../controller/hangHoaController");

route.get("/", getAllHanghoa);
route.get("/:id", getHanghoaById);
route.post("/", addHanghoa);
route.put("/", updateHanghoa);
route.delete("/:id", deleteHanghoa);
module.exports = route;
