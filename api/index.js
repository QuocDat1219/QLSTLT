require("dotenv").config();
const { sqlPool, connectSQL } = require("../config/connectSqlserver");
const { connectMysql } = require("../config/connectMysql");
const { connectOracle } = require("../config/connectOracle");
const express = require("express");
const cors = require("cors");

connectSQL();
connectMysql();
connectOracle();

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

const phanTanNgangRoutes = require("../routes/phanTanNgangRoutes");
const tinhRoutes = require("../routes/tinhRoutes");
const chiNhanhRoutes = require("../routes/chiNhanhRoutes");
const sieuThiRoutes = require("../routes/sieuThiRoutes");
const nhanVienRoutes = require("../routes/nhanVienRoutes");
const khachKhachRoutes = require("../routes/khachHangRoutes");
const donHangRoutes = require("../routes/donHangRoutes");
const chiTietDonHangRoutes = require("../routes/chiTietDonHangRoutes");
const hangHoaRoutes = require("../routes/hangHoaRoutes");
const nhanHangRoutes = require("../routes/nhanHangRoutes");
const danhMucRoutes = require("../routes/danhMucRoutes");
const khuyenMaiRoutes = require("../routes/khuyenMaiRoutes");
const phieuNhapRoutes = require("../routes/phieuNhapRoutes");
const cTPhieuNhapRoutes = require("../routes/ctPhieuNhapRoutes");
const cTKhuyenMaiRoutes = require("../routes/ctKhuyenMaiRoutes");
const taiKhoanRoutes = require("../routes/taiKhoanRoutes");

app.use("/api", phanTanNgangRoutes);
app.use("/api/tinh", tinhRoutes);
app.use("/api/chinhanh", chiNhanhRoutes);
app.use("/api/sieuthi", sieuThiRoutes);
app.use("/api/nhanvien", nhanVienRoutes);
app.use("/api/khachhang", khachKhachRoutes);
app.use("/api/donhang", donHangRoutes);
app.use("/api/ctdonhang", chiTietDonHangRoutes);
app.use("/api/hanghoa", hangHoaRoutes);
app.use("/api/nhanhang", nhanHangRoutes);
app.use("/api/danhmuc", danhMucRoutes);
app.use("/api/khuyenmai", khuyenMaiRoutes);
app.use("/api/phieunhap", phieuNhapRoutes);
app.use("/api/ctphieunhap", cTPhieuNhapRoutes);
app.use("/api/ctkhuyenmai", cTKhuyenMaiRoutes);
app.use("/api/taikhoan", taiKhoanRoutes);

app.use((req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).send({ message: err, message });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
