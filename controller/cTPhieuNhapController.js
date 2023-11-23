const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllCtPhieunhapkho = async (req, res) => {
  try {
    const oracleQuery = `select dh.MaPN as MaPN, TenHH, SoLuong, GiaNhap,dh.GiaBan as GiaBan, ThanhTien, DVT, TenST, HoTen,NgayNhap  from  ctphieunhapkho dh
      inner join phieunhapkho ct on dh.MaPN = ct.MaPN 
      inner join nhanvien nv on nv.MaNV = ct.MaNV 
      inner join hanghoa hh on hh.MaHH = dh.mahh
      inner join danhmuchh dm on hh.DanhMuc = dm.MaDanhMuc
      inner join nhanhang nh on hh.MaNhanHang = nh.manhanhang
      inner join sieuthi st on st.mast = nv.mast`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaPN: row[0],
        TenHH: row[1],
        SoLuong: row[2],
        GiaNhap: row[3],
        GiaBan: row[4],
        ThanhTien: row[5],
        DVT: row[6],
        TenST: row[7],
        HoTen: row[8],
        NgayNhap: row[9],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getCtPhieunhapkhoById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM ctphieunhapkho WHERE MaPN = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaPN: row[0],
        GiaNhap: row[1],
        GiaBan: row[2],
        SoLuong: row[3],
        ThanhTien: row[4],
        DVT: row[5],
        MaHH: row[6],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getCtPhieunhapkhoByDetail = async (req, res) => {
  const maHH = req.query.maHH;
  const maPN = req.query.maPN;
  try {
    const oracleQuery = `SELECT * FROM ctphieunhapkho WHERE MaPN = '${maPN}' AND MaHH = '${maHH}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaPN: row[0],
        GiaNhap: row[1],
        GiaBan: row[2],
        SoLuong: row[3],
        ThanhTien: row[4],
        DVT: row[5],
        MaHH: row[6],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addCtPhieunhapkho = async (req, res) => {
  const { MaPN, GiaNhap, GiaBan, SoLuong, ThanhTien, DVT, MaHH } = req.body;
  const oracleQuery =
    "INSERT INTO ctphieunhapkho (MaPN, GiaNhap, GiaBan, SoLuong, ThanhTien, DVT, MaHH) VALUES (:1, :2, :3, :4, :5, :6, :7)";
  mySqlQuery = `INSERT INTO ctphieunhapkho VALUES('${MaPN}', '${GiaNhap}', '${GiaBan}', '${SoLuong}', '${ThanhTien}', N'${DVT}', '${MaHH}')`;
  const checkCtPhieunhapkho = `SELECT COUNT(*) as count FROM ctphieunhapkho WHERE MaPN = '${MaPN}' AND MaHH = '${MaHH}'`;
  try {
    const recordExists = await checkInsert(checkCtPhieunhapkho);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        console.error(mysqlError);
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [
          MaPN,
          GiaNhap,
          GiaBan,
          SoLuong,
          ThanhTien,
          DVT,
          MaHH,
        ]);
        res.json({ message: "Thêm chi tiết phiếu nhập kho mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm chi tiết phiếu nhập kho" });
  }
};

const updateCtPhieunhapkho = async (req, res) => {
  const { MaPN, GiaNhap, GiaBan, SoLuong, ThanhTien, DVT, MaHH } = req.body;
  const oracleQuery =
    "UPDATE ctphieunhapkho SET GiaNhap = :2, GiaBan = :3, SoLuong = :4, ThanhTien = :5, DVT = :6 WHERE MaPN = :1 AND MaHH = :7";
  const mySqlQuery = `UPDATE ctphieunhapkho SET GiaNhap = '${GiaNhap}', GiaBan = '${GiaBan}', SoLuong = '${SoLuong}', ThanhTien = '${ThanhTien}', DVT = N'${DVT}' WHERE MaPN = '${MaPN}' AND MaHH = '${MaHH}'`;
  const checkCtPhieunhapkho = `SELECT COUNT(*) as count FROM ctphieunhapkho WHERE MaPN = '${MaPN}' AND MaHH = '${MaHH}'`;

  try {
    const recordExists = await checkUpdate(checkCtPhieunhapkho);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [
          MaPN,
          GiaNhap,
          GiaBan,
          SoLuong,
          ThanhTien,
          DVT,
          MaHH,
        ]);
        res.json({ message: "Cập nhật chi tiết phiếu nhập kho thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật chi tiết phiếu nhập kho" });
  }
};

const deleteCtPhieunhapkho = async (req, res) => {
  const { MaPN, MaHH } = req.params;
  const deleteQuery = `DELETE FROM ctphieunhapkho WHERE MaPN = '${MaPN}' AND MaHH = '${MaHH}'`;
  const checkCtPhieunhapkho = `SELECT COUNT(*) as count FROM ctphieunhapkho WHERE MaPN = '${MaPN}' AND MaHH = '${MaHH}'`;
  try {
    const recordExists = await checkInsert(checkCtPhieunhapkho);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy chi tiết phiếu nhập kho" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res
          .status(200)
          .send({ message: "Xóa chi tiết phiếu nhập kho thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllCtPhieunhapkho,
  getCtPhieunhapkhoById,
  addCtPhieunhapkho,
  updateCtPhieunhapkho,
  deleteCtPhieunhapkho,
  getCtPhieunhapkhoByDetail,
};
