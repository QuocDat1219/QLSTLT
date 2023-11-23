const express = require("express");
const route = express.Router();

const {
  getAllNhanhang,
  getNhanhangById,
  addNhanhang,
  updateNhanhang,
  deleteNhanhang,
} = require("../controller/nhanHangController");

route.get("/", getAllNhanhang);
route.get("/:id", getNhanhangById);
route.post("/", addNhanhang);
route.put("/", updateNhanhang);
route.delete("/:id", deleteNhanhang);
module.exports = route;
