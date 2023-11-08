const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");

const migateData = async (req, res) => {
  const { bang, cot, phantan, bangvitu, cotvitu, dieukien } = req.body;
  let tinhOra,
    tinhSQl,
    chinhanhSQl,
    chinhanhOra,
    nhanVienOra,
    sieuThiOra,
    khachHangOra,
    donHangOra,
    ctDonHangOra,
    hangHoaOra,
    nhanHieuOra,
    danhMucOra,
    khuyenMaiOra,
    ctKhuyenMaiOra,
    ctPhieuNhapOra,
    phieuNhapOra = "";
  if (bangvitu || cotvitu || dieukien) {
    tinhOra = `SELECT * from ${bang} WHERE ${cot} = '${phantan}'`;
    chinhanhOra = `SELECT cn.* from chinhanh cn inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    sieuThiOra = `SELECT ch.* from sieuthi ch inner join chinhanh cn on cn.MaCN = ch.MaCN inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    nhanVienOra = `SELECT nv.* from nhanvien nv inner join sieuthi ch on nv.MaST = ch.MaST inner join chinhanh cn on cn.MaCN = ch.MaCN inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    khachHangOra = `SELECT nv.* from khachhang nv inner join sieuthi ch on nv.MaST = ch.MaST inner join chinhanh cn on cn.MaCN = ch.MaCN inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    donHangOra = `SELECT dh.* from donhang dh 
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    ctDonHangOra = `SELECT ctdh.* from ctdonhang ctdh inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    hangHoaOra = `SELECT hh.* from hanghoa hh 
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    nhanHieuOra = `select * from nhanhang`;
    danhMucOra = `select * from danhmuchh`;
    ctKhuyenMaiOra = `SELECT ctkm.* from ctkhuyenmai ctkm 
    inner join hanghoa hh on ctkm.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    khuyenMaiOra = `SELECT km.* from khuyenmai km 
    inner join ctkhuyenmai ctkm on km.MaKM = ctkm.MaKM
    inner join hanghoa hh on ctkm.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    ctPhieuNhapOra = `SELECT ctpn.* from ctphieunhapkho ctpn 
    inner join hanghoa hh on ctpn.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    phieuNhapOra = `SELECT pn.* from phieunhapkho pn 
    inner join ctphieunhapkho ctpn on pn.MaPN = ctpn.MaPN
    inner join hanghoa hh on ctpn.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}' and cn.${cotvitu} = '${dieukien}'`;
    tinhSQl = `select * into tinh from openquery(QLSTLT,'select * from tinh') except select * from openquery(QLSTLT,'select * from tinh where ${cot} = ''${phantan}''')`;
    chinhanhSQl = `select cn.* into chinhanh from tinh inner join openquery(QLSTLT,'select * from chinhanh') cn on cn.MaTinh = tinh.MaTinh`;
  } else {
    tinhOra = `SELECT * from ${bang} WHERE ${cot} = '${phantan}'`;
    chinhanhOra = `SELECT cn.* from chinhanh cn inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}'`;
    sieuThiOra = `SELECT ch.* from sieuthi ch inner join chinhanh cn on cn.MaCN = ch.MaCN inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}'`;
    nhanVienOra = `SELECT nv.* from nhanvien nv inner join sieuthi ch on nv.MaST = ch.MaST inner join chinhanh cn on cn.MaCN = ch.MaCN inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}'`;
    khachHangOra = `SELECT nv.* from khachhang nv inner join sieuthi ch on nv.MaST = ch.MaST inner join chinhanh cn on cn.MaCN = ch.MaCN inner join tinh on cn.MaTinh = tinh.MaTinh WHERE tinh.${cot} = '${phantan}'`;
    donHangOra = `SELECT dh.* from donhang dh 
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}'`;
    ctDonHangOra = `SELECT ctdh.* from ctdonhang ctdh inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}'`;
    hangHoaOra = `SELECT hh.* from hanghoa hh 
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}'`;
    nhanHieuOra = `select * from nhanhang`;
    danhMucOra = `select * from danhmuchh`;
    ctKhuyenMaiOra = `SELECT ctkm.* from ctkhuyenmai ctkm 
    inner join hanghoa hh on ctkm.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}'`;
    khuyenMaiOra = `SELECT km.* from khuyenmai km 
    inner join ctkhuyenmai ctkm on km.MaKM = ctkm.MaKM
    inner join hanghoa hh on ctkm.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}'`;
    ctPhieuNhapOra = `SELECT ctpn.* from ctphieunhapkho ctpn 
    inner join hanghoa hh on ctpn.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}'`;
    phieuNhapOra = `SELECT pn.* from phieunhapkho pn 
    inner join ctphieunhapkho ctpn on pn.MaPN = ctpn.MaPN
    inner join hanghoa hh on ctpn.MaHH = hh.MaHH
    inner join ctdonhang ctdh on hh.MaHH = ctdh.MaHH
    inner join donhang dh on ctdh.MaDH = dh.MaDH
    inner join khachhang kh on kh.MaKH = dh.MaKH
    inner join sieuthi ch on kh.MaST = ch.MaST 
    inner join nhanvien nv on nv.MaST = ch.MaST
    inner join chinhanh cn on cn.MaCN = ch.MaCN 
    inner join tinh on cn.MaTinh = tinh.MaTinh 
    WHERE tinh.${cot} = '${phantan}'`;
    tinhSQl = `select * into tinh from openquery(QLSTLT,'select * from tinh') except select * from openquery(QLSTLT,'select * from tinh where ${cot} = ''${phantan}''')`;
    chinhanhSQl = `select cn.* into chinhanh from tinh inner join openquery(QLSTLT,'select * from chinhanh') cn on cn.MaTinh = tinh.MaTinh`;
  }
  if (bang || cot || dieukien) {
    // Lấy dữ liệu từ bảng tinh trong MySQL
    const resultTinh = await mysqlConnection.promise().query(tinhOra);
    const [resultsTinh] = resultTinh;

    // Kiểm tra bảng Tinh đã tồn tại trong Oracle
    const checkTableQueryTinh =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'TINH'";
    const resultTinhTable = await executeOracleQuery(checkTableQueryTinh);
    const tableCountTinh = resultTinhTable.rows[0][0];
    // Tạo bảng Tinh ở oracle với các cột
    const oracleQueryTinh =
      "CREATE TABLE Tinh (MaTinh varchar2(20) PRIMARY KEY, TenTinh varchar2(200), KhuVuc varchar2(200), GhiChu varchar2(200))";
    await executeOracleQuery(oracleQueryTinh);

    // Báo lỗi nếu bảng tồn tại
    if (tableCountTinh > 0) {
      res.send({ message: "Bảng tỉnh đã tồn tại" });
    } else {
      // Thêm dữ liệu vào bảng Tinh ở Oracle
      for (const row of resultsTinh) {
        const MaTinh = row.MaTinh;
        const TenTinh = row.TenTinh;
        const KhuVuc = row.KhuVuc;
        const GhiChu = row.GhiChu;

        const insertQueryTinh =
          "INSERT INTO Tinh (MaTinh, TenTinh, KhuVuc, GhiChu) VALUES (:MaTinh, :TenTinh, :KhuVuc, :GhiChu)";
        const insertParamsTinh = [MaTinh, TenTinh, KhuVuc, GhiChu];
        await executeOracleQuery(insertQueryTinh, insertParamsTinh);
      }
    }

    //PHÂN TÁN CHI NHÁNH
    const resultChiNhanh = await mysqlConnection.promise().query(chinhanhOra);
    const [resultsChiNhanh] = resultChiNhanh;
    const checkTableQueryChiNhanh =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'CHINHANH'";
    const resultChiNhanhTable = await executeOracleQuery(
      checkTableQueryChiNhanh
    );
    const tableCountChiNhanh = resultChiNhanhTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountChiNhanh > 0) {
      res.send({ message: "Bảng ChiNhanh đã tồn tại" });
    } else {
      // Tạo bảng ChiNhanh ở oracle với các cột
      const oracleQueryChiNhanh =
        "CREATE TABLE ChiNhanh (MaCN varchar2(20) primary key, TenCN varchar2(50), DiaChi varchar2(50), MaTinh varchar2(20))";
      await executeOracleQuery(oracleQueryChiNhanh);

      // Thêm dữ liệu vào bảng ChiNhanh ở Oracle
      for (const row of resultsChiNhanh) {
        const MaCN = row.MaCN;
        const TenCN = row.TenCN;
        const DiaChi = row.DiaChi;
        const MaTinh = row.MaTinh;

        const insertQueryChiNhanh =
          "INSERT INTO ChiNhanh (MaCN , TenCN, DiaChi, MaTinh) VALUES (:MaCN, :TenCN, :DiaChi, :MaTinh)";
        const insertParamsChiNhanh = [MaCN, TenCN, DiaChi, MaTinh];
        await executeOracleQuery(insertQueryChiNhanh, insertParamsChiNhanh);
      }
      // Tạo khóa ngoại từ MaTinh đến bảng Tinh
      const fkQueryChiNhanh =
        "ALTER TABLE ChiNhanh ADD CONSTRAINT fk_chinhanh_tinh FOREIGN KEY (MaTinh) REFERENCES Tinh(MaTinh)";
      await executeOracleQuery(fkQueryChiNhanh);
    }

    //PHÂN TÁN SIÊU THỊ
    const resultSieuThi = await mysqlConnection.promise().query(sieuThiOra);
    const [resultsSieuThi] = resultSieuThi;

    // Kiểm tra bảng SieuThi đã tồn tại trong Oracle
    const checkTableQuerySieuThi =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'SieuThi'";
    const resultSieuThiTable = await executeOracleQuery(checkTableQuerySieuThi);
    const tableCountSieuThi = resultSieuThiTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountSieuThi > 0) {
      res.send({ message: "Bảng SieuThi đã tồn tại" });
    } else {
      // Thêm dữ liệu vào bảng SieuThi ở Oracle
      const oracleQuerySieuThi =
        "CREATE TABLE SieuThi (MaST varchar2(20) primary key, TenST varchar2(50), DiaChi varchar2(50), SDT varchar2(11), Email varchar2(20), MaCN varchar2(20))";
      await executeOracleQuery(oracleQuerySieuThi);
      for (const row of resultsSieuThi) {
        const MaST = row.MaST;
        const TenST = row.TenST;
        const DiaChi = row.DiaChi;
        const SDT = row.SDT;
        const Email = row.Email;
        const MaCN = row.MaCN;

        const insertQuerySieuThi =
          "INSERT INTO SieuThi (MaST, TenST, DiaChi, SDT, Email, MaCN) VALUES (:MaST, :TenST, :DiaChi, :SDT, :Email, :MaCN)";
        const insertParamsSieuThi = [MaST, TenST, DiaChi, SDT, Email, MaCN];
        await executeOracleQuery(insertQuerySieuThi, insertParamsSieuThi);
      }

      // Tạo khóa ngoại từ MaCN đến bảng ChiNhanh
      const fkQuerySieuThi =
        "ALTER TABLE SieuThi ADD CONSTRAINT fk_sieuthi_chinhanh FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN)";
      await executeOracleQuery(fkQuerySieuThi);
    }

    //Phân tán nhân viên
    // Lấy dữ liệu từ bảng NhanVien trong MySQL
    const resultNhanVien = await mysqlConnection.promise().query(nhanVienOra);
    const [resultsNhanVien] = resultNhanVien;

    // Kiểm tra bảng NhanVien đã tồn tại trong Oracle
    const checkTableQueryNhanVien =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'NhanVien'";
    const resultNhanVienTable = await executeOracleQuery(
      checkTableQueryNhanVien
    );
    const tableCountNhanVien = resultNhanVienTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountNhanVien > 0) {
      res.send({ message: "Bảng NhanVien đã tồn tại" });
    } else {
      // Thêm dữ liệu vào bảng NhanVien ở Oracle
      const oracleQueryNhanVien = `CREATE TABLE NhanVien (
  MaNV varchar2(20),
  HoTen varchar2(50),
  GioiTinh varchar2(10),
  NgaySinh date,
  DiaChi varchar2(50),
  SDT varchar2(11),
  Email varchar2(20),
  MaST varchar2(20),
  CONSTRAINT pk_nhanvien PRIMARY KEY (MaNV),
  CONSTRAINT fk_nhanvien_sieuthi FOREIGN KEY (MaST) REFERENCES SieuThi(MaST)
)`;
      await executeOracleQuery(oracleQueryNhanVien);

      for (const row of resultsNhanVien) {
        const MaNV = row.MaNV;
        const HoTen = row.HoTen;
        const GioiTinh = row.GioiTinh;
        const NgaySinh = row.NgaySinh;
        const DiaChi = row.DiaChi;
        const SDT = row.SDT;
        const Email = row.Email;
        const MaST = row.MaST;

        const insertQueryNhanVien = `INSERT INTO NhanVien (MaNV, HoTen, GioiTinh, NgaySinh, DiaChi, SDT, Email, MaST)
     VALUES (:MaNV, :HoTen, :GioiTinh, :NgaySinh, :DiaChi, :SDT, :Email, :MaST)`;
        const insertParamsNhanVien = [
          MaNV,
          HoTen,
          GioiTinh,
          NgaySinh,
          DiaChi,
          SDT,
          Email,
          MaST,
        ];
        await executeOracleQuery(insertQueryNhanVien, insertParamsNhanVien);
      }
    }

    //Phân tán khách hàng
    // Lấy dữ liệu từ bảng KhachHang trong MySQL
    const resultKhachHang = await mysqlConnection.promise().query(khachHangOra);
    const [resultsKhachHang] = resultKhachHang;

    // Kiểm tra bảng KhachHang đã tồn tại trong Oracle
    const checkTableQueryKhachHang =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'KhachHang'";
    const resultKhachHangTable = await executeOracleQuery(
      checkTableQueryKhachHang
    );
    const tableCountKhachHang = resultKhachHangTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountKhachHang > 0) {
      res.send({ message: "Bảng KhachHang đã tồn tại" });
    } else {
      // Tạo bảng KhachHang ở Oracle với các cột và khóa ngoại
      const oracleQueryKhachHang = `CREATE TABLE KhachHang (
  MaKH varchar2(20),
  TenKH varchar2(50),
  SDT varchar2(11),
  DiaChi varchar2(50),
  MaST varchar2(20),
  CONSTRAINT pk_khachhang PRIMARY KEY (MaKH),
  CONSTRAINT fk_khachhang_sieuthi FOREIGN KEY (MaST) REFERENCES SieuThi(MaST)
)`;
      await executeOracleQuery(oracleQueryKhachHang);
      for (const row of resultsKhachHang) {
        const MaKH = row.MaKH;
        const TenKH = row.TenKH;
        const SDT = row.SDT;
        const DiaChi = row.DiaChi;
        const MaST = row.MaST;

        const insertQueryKhachHang = `INSERT INTO KhachHang (MaKH, TenKH, SDT, DiaChi, MaST)
     VALUES (:MaKH, :TenKH, :SDT, :DiaChi, :MaST)`;

        const insertParamsKhachHang = [MaKH, TenKH, SDT, DiaChi, MaST];
        await executeOracleQuery(insertQueryKhachHang, insertParamsKhachHang);
      }
    }

    //Phân tán đơn hàng
    const resultDonHang = await mysqlConnection.promise().query(donHangOra);
    const [resultsDonHang] = resultDonHang;

    // Kiểm tra bảng DonHang đã tồn tại trong Oracle
    const checkTableQueryDonHang =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'DonHang'";
    const resultDonHangTable = await executeOracleQuery(checkTableQueryDonHang);
    const tableCountDonHang = resultDonHangTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountDonHang > 0) {
      res.send({ message: "Bảng DonHang đã tồn tại" });
    } else {
      // Thêm dữ liệu vào bảng DonHang ở Oracle
      const oracleQueryDonHang = `CREATE TABLE DonHang (
        MaDH varchar2(20),
        NgayDH date,
        ThanhToan varchar2(20),
        MaNV varchar2(20),
        MaKH varchar2(20),
        CONSTRAINT pk_donhang PRIMARY KEY (MaDH),
        CONSTRAINT fk_donhang_nhanvien FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV),
        CONSTRAINT fk_donhang_khachhang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
      )`;
      await executeOracleQuery(oracleQueryDonHang);
      for (const row of resultsDonHang) {
        const MaDH = row.MaDH;
        const NgayDH = row.NgayDH;
        const ThanhToan = row.ThanhToan;
        const MaNV = row.MaNV;
        const MaKH = row.MaKH;

        const insertQueryDonHang = `INSERT INTO DonHang (MaDH, NgayDH, ThanhToan, MaNV, MaKH)
     VALUES (:MaDH, :NgayDH, :ThanhToan, :MaNV, :MaKH)`;

        const insertParamsDonHang = [MaDH, NgayDH, ThanhToan, MaNV, MaKH];
        await executeOracleQuery(insertQueryDonHang, insertParamsDonHang);
      }
    }

    //Phân tán chi tiết đơn hàng
    const resultChiTietDonHang = await mysqlConnection
      .promise()
      .query(ctDonHangOra);
    const [resultsChiTietDonHang] = resultChiTietDonHang;

    // Kiểm tra bảng ChiTietDonHang đã tồn tại trong Oracle
    const checkTableQueryChiTietDonHang =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'ctdonhang'";
    const resultChiTietDonHangTable = await executeOracleQuery(
      checkTableQueryChiTietDonHang
    );
    const tableCountChiTietDonHang = resultChiTietDonHangTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountChiTietDonHang > 0) {
      res.send({ message: "Bảng ctdonhang đã tồn tại" });
    } else {
      // Tạo bảng ChiTietDonHang ở Oracle với các cột và khóa ngoại
      const oracleQueryChiTietDonHang = `CREATE TABLE ctdonhang (
      MaDH varchar2(20),
      MaHH varchar2(20),
      SL number,
      DVT varchar2(20),
      ThanhTien number,
      CONSTRAINT pk_chitietdonhang PRIMARY KEY (MaDH, MaHH),
      CONSTRAINT fk_chitietdonhang_donhang FOREIGN KEY (MaDH) REFERENCES DonHang(MaDH)
    )`;
      await executeOracleQuery(oracleQueryChiTietDonHang);

      for (const row of resultsChiTietDonHang) {
        const MaDH = row.MaDH;
        const MaHH = row.MaHH;
        const SL = row.SL;
        const DVT = row.DVT;
        const ThanhTien = row.ThanhTien;

        const insertQueryChiTietDonHang = `INSERT INTO ctdonhang (MaDH, MaHH, SL, DVT, ThanhTien)
     VALUES (:MaDH, :MaHH, :SL, :DVT, :ThanhTien)`;

        const insertParamsChiTietDonHang = [MaDH, MaHH, SL, DVT, ThanhTien];
        await executeOracleQuery(
          insertQueryChiTietDonHang,
          insertParamsChiTietDonHang
        );
      }
    }

    //Phân tán hàng hóa
    // Lấy dữ liệu từ bảng HangHoa trong MySQL
    const resultHangHoa = await mysqlConnection.promise().query(hangHoaOra);
    const [resultsHangHoa] = resultHangHoa;

    // Kiểm tra bảng HangHoa đã tồn tại trong Oracle
    const checkTableQueryHangHoa =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'HangHoa'";
    const resultHangHoaTable = await executeOracleQuery(checkTableQueryHangHoa);
    const tableCountHangHoa = resultHangHoaTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountHangHoa > 0) {
      res.send({ message: "Bảng HangHoa đã tồn tại" });
    } else {
      // Tạo bảng HangHoa ở Oracle với các cột và khóa ngoại
      const oracleQueryHangHoa = `CREATE TABLE HangHoa (
      MaHH varchar2(20),
      TenHH varchar2(50),
      GiaBan number,
      GhiChu varchar2(100),
      MaNhanHang varchar2(20),
      MaDanhMuc varchar2(20),
      CONSTRAINT pk_hanghoa PRIMARY KEY (MaHH)
    )`;
      await executeOracleQuery(oracleQueryHangHoa);

      for (const row of resultsHangHoa) {
        const MaHH = row.MaHH;
        const TenHH = row.TenHH;
        const GiaBan = row.GiaBan;
        const GhiChu = row.GhiChu;
        const MaNhanHang = row.MaNhanHang;
        const MaDanhMuc = row.MaDanhMuc;

        const insertQueryHangHoa = `INSERT INTO HangHoa (MaHH, TenHH, GiaBan, GhiChu, MaNhanHang, MaDanhMuc)
     VALUES (:MaHH, :TenHH, :GiaBan, :GhiChu, :MaNhanHang, :MaDanhMuc)`;

        const insertParamsHangHoa = [
          MaHH,
          TenHH,
          GiaBan,
          GhiChu,
          MaNhanHang,
          MaDanhMuc,
        ];
        await executeOracleQuery(insertQueryHangHoa, insertParamsHangHoa);
      }

      const fkCTDH =
        "ALTER TABLE ctdonhang ADD CONSTRAINT fk_ctdh_hh FOREIGN KEY (MaHH) REFERENCES hanghoa(MaHH)";
      await executeOracleQuery(fkCTDH);
    }

    //Phân tán nhãn hàng
    const resultNhanHang = await mysqlConnection.promise().query(nhanHieuOra);
    const [resultsNhanHang] = resultNhanHang;

    // Kiểm tra bảng NhanHang đã tồn tại trong Oracle
    const checkTableQueryNhanHang =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'NhanHang'";
    const resultNhanHangTable = await executeOracleQuery(
      checkTableQueryNhanHang
    );
    const tableCountNhanHang = resultNhanHangTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountNhanHang > 0) {
      res.send({ message: "Bảng NhanHang đã tồn tại" });
    } else {
      // Tạo bảng NhanHang ở Oracle với các cột và khóa chính
      const oracleQueryNhanHang = `CREATE TABLE NhanHang (
      MaNhanHang varchar2(20),
      Ten varchar2(50),
      GhiChu varchar2(100),
      CONSTRAINT pk_nhanhang PRIMARY KEY (MaNhanHang)
    )`;
      await executeOracleQuery(oracleQueryNhanHang);
      for (const row of resultsNhanHang) {
        const MaNhanHang = row.MaNhanHang;
        const Ten = row.Ten;
        const GhiChu = row.GhiChu;

        const insertQueryNhanHang = `INSERT INTO NhanHang (MaNhanHang, Ten, GhiChu)
     VALUES (:MaNhanHang, :Ten, :GhiChu)`;

        const insertParamsNhanHang = [MaNhanHang, Ten, GhiChu];
        await executeOracleQuery(insertQueryNhanHang, insertParamsNhanHang);
      }
      // Tạo khóa ngoại từ bảng HangHoa (MaNhanHang) đến bảng NhanHang (MaNhanHang)
      const alterQueryHangHoa =
        "ALTER TABLE HangHoa ADD CONSTRAINT fk_hanghoa_nhanhang FOREIGN KEY (MaNhanHang) REFERENCES NhanHang(MaNhanHang)";
      await executeOracleQuery(alterQueryHangHoa);
    }

    //Phân tán danh mục hàng hóa
    const resultDanhMucHH = await mysqlConnection.promise().query(danhMucOra);
    const [resultsDanhMucHH] = resultDanhMucHH;

    // Kiểm tra bảng DanhMucHH đã tồn tại trong Oracle
    const checkTableQueryDanhMucHH =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'DanhMucHH'";
    const resultDanhMucHHTable = await executeOracleQuery(
      checkTableQueryDanhMucHH
    );
    const tableCountDanhMucHH = resultDanhMucHHTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountDanhMucHH > 0) {
      res.send({ message: "Bảng DanhMucHH đã tồn tại" });
    } else {
      // Tạo bảng DanhMucHH ở Oracle với các cột và khóa chính
      const oracleQueryDanhMucHH = `CREATE TABLE DanhMucHH (
      MaDanhMuc varchar2(20),
      Ten varchar2(50),
      GhiChu varchar2(100),
      CONSTRAINT pk_danhmuchh PRIMARY KEY (MaDanhMuc)
    )`;
      await executeOracleQuery(oracleQueryDanhMucHH);
      for (const row of resultsDanhMucHH) {
        const MaDanhMuc = row.MaDanhMuc;
        const Ten = row.Ten;
        const GhiChu = row.GhiChu;

        const insertQueryDanhMucHH = `INSERT INTO DanhMucHH (MaDanhMuc, Ten, GhiChu)
     VALUES (:MaDanhMuc, :Ten, :GhiChu)`;

        const insertParamsDanhMucHH = [MaDanhMuc, Ten, GhiChu];
        await executeOracleQuery(insertQueryDanhMucHH, insertParamsDanhMucHH);
      }
      // Tạo khóa ngoại từ bảng HangHoa (MaDanhMuc) đến bảng DanhMucHH (MaDanhMuc)
      const alterQueryHangHoa =
        "ALTER TABLE HangHoa ADD CONSTRAINT fk_hanghoa_danhmuc FOREIGN KEY (MaDanhMuc) REFERENCES DanhMucHH(MaDanhMuc)";
      await executeOracleQuery(alterQueryHangHoa);
    }

    //PHÂN TÁN CHI TIẾT KHUYẾN MÃI
    const resultChiTietKhuyenMai = await mysqlConnection
      .promise()
      .query(ctKhuyenMaiOra);
    const [resultsChiTietKhuyenMai] = resultChiTietKhuyenMai;

    // Kiểm tra bảng ChiTietKhuyenMai đã tồn tại trong Oracle
    const checkTableQueryChiTietKhuyenMai =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'ctkhuyenmai'";
    const resultChiTietKhuyenMaiTable = await executeOracleQuery(
      checkTableQueryChiTietKhuyenMai
    );
    const tableCountChiTietKhuyenMai = resultChiTietKhuyenMaiTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountChiTietKhuyenMai > 0) {
      res.send({ message: "Bảng ctkhuyenmai đã tồn tại" });
    } else {
      // Tạo bảng ChiTietKhuyenMai ở Oracle với các cột và khóa chính
      const oracleQueryChiTietKhuyenMai = `CREATE TABLE ctkhuyenmai (
      MaKM varchar2(20),
      MucGiam number,
      NgayApDung date,
      NgayHetHan date,
      MaHH varchar2(20),
      CONSTRAINT pk_chitietkhuyenmai PRIMARY KEY (MaKM,MaHH),
      CONSTRAINT fk_chitietkhuyenmai_hanghoa FOREIGN KEY (MaHH) REFERENCES HangHoa(MaHH)
    )`;
      await executeOracleQuery(oracleQueryChiTietKhuyenMai);

      for (const row of resultsChiTietKhuyenMai) {
        const MaKM = row.MaKM;
        const MucGiam = row.MucGiam;
        const NgayApDung = row.NgayApDung;
        const NgayHetHan = row.NgayHetHan;
        const MaHH = row.MaHH;

        const insertQueryChiTietKhuyenMai = `INSERT INTO ctkhuyenmai (MaKM, MucGiam, NgayApDung, NgayHetHan, MaHH)
     VALUES (:MaKM, :MucGiam, :NgayApDung, :NgayHetHan, :MaHH)`;

        const insertParamsChiTietKhuyenMai = [
          MaKM,
          MucGiam,
          NgayApDung,
          NgayHetHan,
          MaHH,
        ];
        await executeOracleQuery(
          insertQueryChiTietKhuyenMai,
          insertParamsChiTietKhuyenMai
        );
      }
    }

    //PHÂN TÁN BẢNG KHUYẾN MÃI
    const resultKhuyenMai = await mysqlConnection.promise().query(khuyenMaiOra);
    const [resultsKhuyenMai] = resultKhuyenMai;

    // Kiểm tra bảng KhuyenMai đã tồn tại trong Oracle
    const checkTableQueryKhuyenMai =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'KhuyenMai'";
    const resultKhuyenMaiTable = await executeOracleQuery(
      checkTableQueryKhuyenMai
    );
    const tableCountKhuyenMai = resultKhuyenMaiTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountKhuyenMai > 0) {
      res.send({ message: "Bảng KhuyenMai đã tồn tại" });
    } else {
      // Tạo bảng KhuyenMai ở Oracle với các cột và khóa chính
      const oracleQueryKhuyenMai = `CREATE TABLE KhuyenMai (
      MaKM varchar2(20),
      Ten varchar2(50),
      NoiDung varchar2(100),
      CONSTRAINT pk_khuyenmai PRIMARY KEY (MaKM)
    )`;
      await executeOracleQuery(oracleQueryKhuyenMai);

      for (const row of resultsKhuyenMai) {
        const MaKM = row.MaKM;
        const Ten = row.Ten;
        const NoiDung = row.NoiDung;

        const insertQueryKhuyenMai = `INSERT INTO KhuyenMai (MaKM, Ten, NoiDung)
     VALUES (:MaKM, :Ten, :NoiDung)`;

        const insertParamsKhuyenMai = [MaKM, Ten, NoiDung];
        await executeOracleQuery(insertQueryKhuyenMai, insertParamsKhuyenMai);
      }
      // Tạo khóa ngoại từ bảng ChiTietKhuyenMai (MaKM) đến bảng KhuyenMai (MaKM)
      const alterQueryChiTietKhuyenMai =
        "ALTER TABLE ctkhuyenmai ADD CONSTRAINT fk_chitietkhuyenmai_khuyenmai FOREIGN KEY (MaKM) REFERENCES KhuyenMai(MaKM)";
      await executeOracleQuery(alterQueryChiTietKhuyenMai);
    }

    //CHI TIẾT PHIẾU NHẬP KHO
    // Lấy dữ liệu từ bảng ChiTietPhieuNhapKho trong MySQL
    const resultChiTietPhieuNhapKho = await mysqlConnection
      .promise()
      .query(ctPhieuNhapOra);
    const [resultsChiTietPhieuNhapKho] = resultChiTietPhieuNhapKho;

    // Kiểm tra bảng ChiTietPhieuNhapKho đã tồn tại trong Oracle
    const checkTableQueryChiTietPhieuNhapKho =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'ctphieunhapkho'";
    const resultChiTietPhieuNhapKhoTable = await executeOracleQuery(
      checkTableQueryChiTietPhieuNhapKho
    );
    const tableCountChiTietPhieuNhapKho =
      resultChiTietPhieuNhapKhoTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountChiTietPhieuNhapKho > 0) {
      res.send({ message: "Bảng ChiTietPhieuNhapKho đã tồn tại" });
    } else {
      // Tạo bảng ChiTietPhieuNhapKho ở Oracle với các cột và khóa chính
      const oracleQueryChiTietPhieuNhapKho = `CREATE TABLE ctphieunhapkho (
  MaPN varchar2(20),
  GiaNhap number,
  GiaBan number,
  SoLuong number,
  ThanhTien number,
  DVT varchar2(20),
  MaHH varchar2(20),
  CONSTRAINT pk_chitietphieunhapkho PRIMARY KEY (MaPN, MaHH),
  CONSTRAINT fk_chitietphieunhapkho_hanghoa FOREIGN KEY (MaHH) REFERENCES HangHoa(MaHH)
)`;
      await executeOracleQuery(oracleQueryChiTietPhieuNhapKho);

      for (const row of resultsChiTietPhieuNhapKho) {
        const MaPN = row.MaPN;
        const GiaNhap = row.GiaNhap;
        const GiaBan = row.GiaBan;
        const SoLuong = row.SoLuong;
        const ThanhTien = row.ThanhTien;
        const DVT = row.DVT;
        const MaHH = row.MaHH;

        const insertQueryChiTietPhieuNhapKho = `INSERT INTO ctphieunhapkho (MaPN, GiaNhap, GiaBan, SoLuong, ThanhTien, DVT, MaHH)
       VALUES (:MaPN, :GiaNhap, :GiaBan, :SoLuong, :ThanhTien, :DVT, :MaHH)`;

        const insertParamsChiTietPhieuNhapKho = [
          MaPN,
          GiaNhap,
          GiaBan,
          SoLuong,
          ThanhTien,
          DVT,
          MaHH,
        ];
        await executeOracleQuery(
          insertQueryChiTietPhieuNhapKho,
          insertParamsChiTietPhieuNhapKho
        );
      }
    }

    //PHÂN TÁN PHIẾU NHẬP KHO

    // Lấy dữ liệu từ bảng PhieuNhapKho trong MySQL
    const resultPhieuNhapKho = await mysqlConnection
      .promise()
      .query(phieuNhapOra);
    const [resultsPhieuNhapKho] = resultPhieuNhapKho;

    // Kiểm tra bảng PhieuNhapKho đã tồn tại trong Oracle
    const checkTableQueryPhieuNhapKho =
      "SELECT COUNT(*) FROM user_tables WHERE table_name = 'PhieuNhapKho'";
    const resultPhieuNhapKhoTable = await executeOracleQuery(
      checkTableQueryPhieuNhapKho
    );
    const tableCountPhieuNhapKho = resultPhieuNhapKhoTable.rows[0][0];

    // Báo lỗi nếu bảng tồn tại
    if (tableCountPhieuNhapKho > 0) {
      res.send({ message: "Bảng PhieuNhapKho đã tồn tại" });
    } else {
      // Tạo bảng PhieuNhapKho ở Oracle với các cột và khóa chính
      const oracleQueryPhieuNhapKho = `CREATE TABLE PhieuNhapKho (
  MaPN varchar2(20),
  NgayNhap date,
  GhiChu varchar2(100),
  MaNV varchar2(20),
  MaST varchar2(20),
  CONSTRAINT pk_phieunhapkho PRIMARY KEY (MaPN),
  CONSTRAINT fk_phieunhapkho_nhanvien FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV),
  CONSTRAINT fk_phieunhapkho_sieuthi FOREIGN KEY (MaST) REFERENCES SieuThi(MaST)
)`;
      await executeOracleQuery(oracleQueryPhieuNhapKho);

      for (const row of resultsPhieuNhapKho) {
        const MaPN = row.MaPN;
        const NgayNhap = row.NgayNhap;
        const GhiChu = row.GhiChu;
        const MaNV = row.MaNV;
        const MaST = row.MaST;

        const insertQueryPhieuNhapKho = `INSERT INTO PhieuNhapKho (MaPN, NgayNhap, GhiChu, MaNV, MaST)
     VALUES (:MaPN, :NgayNhap, :GhiChu, :MaNV, :MaST)`;

        const insertParamsPhieuNhapKho = [MaPN, NgayNhap, GhiChu, MaNV, MaST];
        await executeOracleQuery(
          insertQueryPhieuNhapKho,
          insertParamsPhieuNhapKho
        );
      }

      // Tạo khóa ngoại từ bảng ChiTietPhieuNhapKho (MaPN) đến bảng PhieuNhapKho (MaPN)
      const alterQueryChiTietPhieuNhapKho =
        "ALTER TABLE ctphieunhapkho ADD CONSTRAINT fk_chitietphieunhapkho_phieunhapkho FOREIGN KEY (MaPN) REFERENCES PhieuNhapKho(MaPN)";
      await executeOracleQuery(alterQueryChiTietPhieuNhapKho);
    }

    //PHÂN TÁN ĐẾN SQL SERVER
    const migrateSQL = [
      // Phân tán tỉnh
      tinhSQl,
      `alter table tinh add constraint PRI_T primary key (MaTinh)`,

      // Phân tán chi nhánh theo tỉnh
      chinhanhSQl,
      `alter table chinhanh add constraint PRI_cn primary key (MaCN)`,
      `alter table chinhanh add constraint FK_CN_T foreign key (MaTinh) references tinh(MaTinh)`,

      // Phân tán cửa hàng
      `select st.* into sieuthi from chinhanh cn inner join openquery(QLSTLT,'select * from sieuthi') st on st.MaCN = cn.MaCN`,
      `alter table sieuthi add constraint PRI_st primary key (MaST)`,
      `alter table sieuthi add constraint FK_CN_ST foreign key (MaCN) references chinhanh(MaCN)`,

      // Phân tán nhân viên
      `select nv.* into nhanvien from sieuthi st inner join openquery(QLSTLT,'select * from nhanvien') nv on st.MaST = nv.MaST`,
      `alter table nhanvien add constraint PRI_nv primary key (MaNV)`,
      `alter table nhanvien add constraint FK_NV_ST foreign key (MaST) references sieuthi(MaST)`,

      // Phân tán khách hàng
      `select kh.* into khachhang from sieuthi st inner join openquery(QLSTLT,'select * from khachhang') kh on st.MaST = kh.MaST`,
      `alter table khachhang add constraint PRI_kh primary key (MaKH)`,
      `alter table khachhang add constraint FK_KH_ST foreign key (MaST) references sieuthi(MaST)`,

      // Phân tán đơn hàng
      `select dh.* into donhang from nhanvien nv inner join openquery(QLSTLT,'select * from donhang') dh on dh.MaNV = nv.MaNV GROUP BY dh.MADH,dh.NgayDH,dh.ThanhToan,dh.MaNV,dh.MaKH`,
      `alter table donhang add constraint PRI_dh primary key (MaDH)`,
      `alter table donhang add constraint FK_KH_DH foreign key (MaKH) references khachhang(MaKH)`,
      `alter table donhang add constraint FK_NV_DH foreign key (MaNV) references nhanvien(MaNV)`,

      // Phân tán chi tiết đơn hàng
      `select ct.* into ctdonhang from donhang dh inner join openquery(QLSTLT,'select * from ctdonhang') ct on dh.MaDH = ct.MaDH GROUP BY ct.MADH,ct.MaHH,ct.SL,ct.DVT,ct.ThanhTien`,
      `alter table ctdonhang add constraint PRI_ctdonhang primary key (MaDH,MaHH)`,
      `alter table ctdonhang add constraint FK_CTDH_DH foreign key (MaDH) references donhang(MaDH)`,

      // Phân tán hàng hóa
      `select hh.* into hanghoa from ctdonhang ct inner join openquery(QLSTLT,'select * from hanghoa') hh on hh.MaHH = ct.MaHH GROUP BY hh.MaHH,hh.TenHH,hh.GiaBan,hh.GhiChu,hh.MaNhanHang,hh.DanhMuc`,
      `alter table hanghoa add constraint PRI_hh primary key (MaHH)`,
      `alter table ctdonhang add constraint FK_CTDH_HH foreign key (MaHH) references hanghoa(MaHH)`,

      // Phân tán nhãn hàng
      `select * into nhanhang from openquery(QLSTLT,'select * from nhanhang')`,
      `alter table nhanhang add constraint PRI_nh primary key (MaNhanHang)`,
      `alter table hanghoa add constraint FK_NH_HH foreign key (MaNhanHang) references nhanhang(MaNhanHang)`,

      // Phân tán danh mục
      `select * into danhmuchh from openquery(QLSTLT,'select * from danhmuchh')`,
      `alter table danhmuchh add constraint PRI_dmhh primary key (MaDanhMuc)`,
      `alter table hanghoa add constraint FK_DM_HH foreign key (DanhMuc) references danhmuchh(MaDanhMuc)`,

      // Phân tán chi tiết khuyến mãi
      `select ctkm.* into ctkhuyenmai from hanghoa hh inner join openquery(QLSTLT,'select * from ctkhuyenmai') ctkm on ctkm.MaHH = hh.MaHH GROUP BY ctkm.MaKM,ctkm.MucGiam,ctkm.NgayApDung,ctkm.NgayHetHan,ctkm.MaHH`,
      `alter table ctkhuyenmai add constraint PRI_ctkm primary key (MaKM)`,
      `alter table ctkhuyenmai add constraint FK_CTKM_HH foreign key (MaHH) references hanghoa(MaHH)`,

      // Phân tán khuyến mãi
      `select km.* into khuyenmai from ctkhuyenmai ctkm inner join openquery(QLSTLT,'select * from khuyenmai') km on ctkm.MaKM = km.MaKM GROUP BY km.MaKM,km.Ten,km.NoiDung`,
      `alter table khuyenmai add constraint PRI_km primary key (MaKM)`,
      `alter table ctkhuyenmai add constraint FK_CTKM_KM foreign key (MaKM) references khuyenmai(MaKM)`,

      // Phân tán chi tiết phiếu nhập kho
      `select ctpn.* into ctphieunhapkho from hanghoa hh inner join openquery(QLSTLT,'select * from ctphieunhapkho') ctpn on ctpn.MaHH = hh.MaHH GROUP BY ctpn.MaPN,ctpn.GiaNhap,ctpn.GiaBan,ctpn.SoLuong,ctpn.ThanhTien,ctpn.DVT,ctpn.MaHH`,
      `alter table ctphieunhapkho add constraint PRI_ctpnk primary key (MaPN,MaHH)`,
      `alter table ctphieunhapkho add constraint FK_CTPNK_HH foreign key (MaHH) references hanghoa(MaHH)`,

      // Phân tán phiếu nhập kho
      `select pn.* into phieunhapkho from ctphieunhapkho ctpn inner join openquery(QLSTLT,'select * from phieunhapkho') pn on ctpn.MaPN = pn.MaPN GROUP BY pn.MaPN,pn.NgayNhap,pn.GhiChu,pn.MaNV,pn.MaST`,
      `alter table phieunhapkho add constraint PRI_pnk primary key (MaPN)`,
      `alter table phieunhapkho add constraint FK_PNK_NV foreign key (MaNV) references nhanvien(MaNV)`,
      `alter table phieunhapkho add constraint FK_PNK_ST foreign key (MaST) references sieuthi(MaST)`,
    ];
    for (const sqlQuery of migrateSQL) {
      await sqlPool.query(sqlQuery);
    }

    res.status(200).send({ message: "Phân tán thành công" });
  } else {
    res.send({ message: "Chọn điều kiện phân tán" });
  }
};

module.exports = { migateData };
