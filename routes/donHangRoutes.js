const express = require("express");
const route = express.Router();

const {
  getAllDonhang,
  getDonhangById,
  addDonhang,
  updateDonhang,
  deleteDonhang,
} = require("../controller/donHangController");

route.get("/", getAllDonhang);
route.get("/:id", getDonhangById);
route.post("/", addDonhang);
route.put("/", updateDonhang);
route.delete("/:id", deleteDonhang);
module.exports = route;
