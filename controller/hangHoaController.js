const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllHanghoa = async (req, res) => {
  try {
    const oracleQuery =
      "select MaHH,TenHH,GiaBan,hh.GhiChu as GhiChu,nh.Ten as NhanHang, dm.Ten as DanhMuc from hanghoa hh inner join danhmuchh dm on hh.DanhMuc = dm.MaDanhMuc inner join nhanhang nh on nh.MaNhanHang = hh.MaNhanHang";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaHH: row[0],
        TenHH: row[1],
        GiaBan: row[2],
        GhiChu: row[3],
        NhanHang: row[4],
        DanhMuc: row[5],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getHanghoaById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM hanghoa WHERE MaHH = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaHH: row[0],
        TenHH: row[1],
        GiaBan: row[2],
        GhiChu: row[3],
        MaNhanHang: row[4],
        DanhMuc: row[5],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addHanghoa = async (req, res) => {
  const { MaHH, TenHH, GiaBan, GhiChu, MaNhanHang, DanhMuc } = req.body;
  const oracleQuery =
    "INSERT INTO hanghoa (MaHH, TenHH, GiaBan, GhiChu, MaNhanHang, DanhMuc) VALUES (:1, :2, :3, :4, :5, :6)";
  mySqlQuery = `INSERT INTO hanghoa VALUES('${MaHH}', N'${TenHH}', '${GiaBan}', N'${GhiChu}', '${MaNhanHang}', '${DanhMuc}')`;
  const checkHanghoa = `SELECT cOUNT(*) as count FROM hanghoa WHERE MaHH = '${MaHH}'`;
  try {
    const recordExists = await checkInsert(checkHanghoa);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [
          MaHH,
          TenHH,
          GiaBan,
          GhiChu,
          MaNhanHang,
          DanhMuc,
        ]);
        res.json({ message: "Thêm hàng hóa mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm hàng hóa" });
  }
};

const updateHanghoa = async (req, res) => {
  const { MaHH, TenHH, GiaBan, GhiChu, MaNhanHang, DanhMuc } = req.body;
  const oracleQuery =
    "UPDATE hanghoa SET TenHH = :1, GiaBan = :2, GhiChu = :3, MaNhanHang = :4, DanhMuc = :5 WHERE MaHH = :6";
  const mySqlQuery = `UPDATE hanghoa SET TenHH = N'${TenHH}', GiaBan = '${GiaBan}', GhiChu = N'${GhiChu}', MaNhanHang = '${MaNhanHang}', DanhMuc = '${DanhMuc}' WHERE MaHH = '${MaHH}'`;
  const checkHanghoa = `SELECT COUNT(*) as count FROM hanghoa WHERE MaHH = '${MaHH}'`;

  try {
    const recordExists = await checkUpdate(checkHanghoa);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [
          TenHH,
          GiaBan,
          GhiChu,
          MaNhanHang,
          DanhMuc,
          MaHH,
        ]);
        res.json({ message: "Cập nhật hàng hóa thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật hàng hóa" });
  }
};

const deleteHanghoa = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM hanghoa WHERE MaHH = '${id}'`;
  const checkHanghoa = `SELECT cOUNT(*) as count FROM hanghoa WHERE MaHH = '${id}'`;
  try {
    const recordExists = await checkInsert(checkHanghoa);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy hàng hóa" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa hàng hóa thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllHanghoa,
  getHanghoaById,
  addHanghoa,
  updateHanghoa,
  deleteHanghoa,
};
