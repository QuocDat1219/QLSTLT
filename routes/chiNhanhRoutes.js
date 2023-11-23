const express = require("express");
const route = express.Router();

const {
  getAllChinhanh,
  getChinhanhById,
  addChinhanh,
  updateChinhanh,
  deleteChinhanh,
} = require("../controller/chiNhanhController");

route.get("/", getAllChinhanh);
route.get("/:id", getChinhanhById);
route.post("/", addChinhanh);
route.put("/", updateChinhanh);
route.delete("/:id", deleteChinhanh);
module.exports = route;
