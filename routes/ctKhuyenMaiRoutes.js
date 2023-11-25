const express = require("express");
const route = express.Router();

const {
  getAllCtkhuyenmai,
  getCtkhuyenmaiById,
  addCtkhuyenmai,
  updateCtkhuyenmai,
  deleteCtkhuyenmai,
  getCtkhuyenmaiByDetails,
} = require("../controller/cTKhuyenMaiController");

route.get("/", getAllCtkhuyenmai);
route.get("/details", getCtkhuyenmaiByDetails);
route.get("/:id", getCtkhuyenmaiById);
route.post("/", addCtkhuyenmai);
route.put("/", updateCtkhuyenmai);
route.post("/delete", deleteCtkhuyenmai);
module.exports = route;
