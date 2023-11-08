const express = require("express");
const route = express.Router();

const { migateData } = require("../controller/phanTanNgangController");

route.post("/phantan", migateData);

module.exports = route;
