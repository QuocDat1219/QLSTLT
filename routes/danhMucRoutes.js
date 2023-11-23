const express = require("express");
const route = express.Router();

const {
  getAllDanhmucHH,
  getDanhmucHHById,
  addDanhmucHH,
  updateDanhmucHH,
  deleteDanhmucHH,
} = require("../controller/danhMucController");

route.get("/", getAllDanhmucHH);
route.get("/:id", getDanhmucHHById);
route.post("/", addDanhmucHH);
route.put("/", updateDanhmucHH);
route.delete("/:id", deleteDanhmucHH);
module.exports = route;
