const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllDonhang = async (req, res) => {
  try {
    const oracleQuery =
      "select MaDH,NgayDH,ThanhToan, HoTen,TenKH  from donhang dh inner join nhanvien nv on nv.MaNV = dh.MaNV inner join khachhang kh on dh.MaKH = kh.MaKH";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaDH: row[0],
        NgayDH: row[1],
        ThanhToan: row[2],
        MaNV: row[3],
        MaKH: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getDonhangById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM donhang WHERE MaDH = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaDH: row[0],
        NgayDH: row[1],
        ThanhToan: row[2],
        MaNV: row[3],
        MaKH: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addDonhang = async (req, res) => {
  const { MaDH, NgayDH, ThanhToan, MaNV, MaKH } = req.body;
  const oracleQuery =
    "INSERT INTO donhang (MaDH, NgayDH, ThanhToan, MaNV, MaKH) VALUES (:1, TO_DATE(:2, 'yyyy-mm-dd'), :3, :4, :5)";
  mySqlQuery = `INSERT INTO donhang VALUES('${MaDH}', '${NgayDH}', '${ThanhToan}', '${MaNV}', '${MaKH}')`;
  const checkDonhang = `SELECT cOUNT(*) as count FROM donhang WHERE MaDH = '${MaDH}'`;
  try {
    const recordExists = await checkInsert(checkDonhang);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaDH, NgayDH, ThanhToan, MaNV, MaKH]);
        res.json({ message: "Thêm đơn hàng mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm đơn hàng" });
  }
};

const updateDonhang = async (req, res) => {
  const { MaDH, NgayDH, ThanhToan, MaNV, MaKH } = req.body;
  const oracleQuery =
    "UPDATE donhang SET NgayDH = TO_DATE(:1, 'yyyy-mm-dd'), ThanhToan = :2, MaNV = :3, MaKH = :4 WHERE MaDH = :5";
  const mySqlQuery = `UPDATE donhang SET NgayDH = '${NgayDH}', ThanhToan = '${ThanhToan}', MaNV = '${MaNV}', MaKH = '${MaKH}' WHERE MaDH = '${MaDH}'`;
  const checkDonhang = `SELECT COUNT(*) as count FROM donhang WHERE MaDH = '${MaDH}'`;

  try {
    const recordExists = await checkUpdate(checkDonhang);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [NgayDH, ThanhToan, MaNV, MaKH, MaDH]);
        res.json({ message: "Cập nhật đơn hàng thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật đơn hàng" });
  }
};

const deleteDonhang = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM donhang WHERE MaDH = '${id}'`;
  const checkDonhang = `SELECT cOUNT(*) as count FROM donhang WHERE MaDH = '${id}'`;
  try {
    const recordExists = await checkInsert(checkDonhang);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy đơn hàng" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa đơn hàng thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllDonhang,
  getDonhangById,
  addDonhang,
  updateDonhang,
  deleteDonhang,
};
