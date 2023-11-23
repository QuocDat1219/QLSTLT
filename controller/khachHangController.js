const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllKhachhang = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM khachhang";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaKH: row[0],
        TenKH: row[1],
        SDT: row[2],
        DiaChi: row[3],
        MaST: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getKhachhangById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM khachhang WHERE MaKH = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaKH: row[0],
        TenKH: row[1],
        SDT: row[2],
        DiaChi: row[3],
        MaST: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addKhachhang = async (req, res) => {
  const { MaKH, TenKH, SDT, DiaChi, MaST } = req.body;
  const oracleQuery =
    "INSERT INTO khachhang (MaKH, TenKH, SDT, DiaChi, MaST) VALUES (:1, :2, :3, :4, :5)";
  mySqlQuery = `INSERT INTO khachhang VALUES('${MaKH}', N'${TenKH}', '${SDT}', N'${DiaChi}', '${MaST}')`;
  const checkKhachhang = `SELECT cOUNT(*) as count FROM khachhang WHERE MaKH = '${MaKH}'`;
  try {
    const recordExists = await checkInsert(checkKhachhang);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaKH, TenKH, SDT, DiaChi, MaST]);
        res.json({ message: "Thêm khách hàng mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm khách hàng" });
  }
};

const updateKhachhang = async (req, res) => {
  const { MaKH, TenKH, SDT, DiaChi, MaST } = req.body;
  const oracleQuery =
    "UPDATE khachhang SET TenKH = :1, SDT = :2, DiaChi = :3, MaST = :4 WHERE MaKH = :5";
  const mySqlQuery = `UPDATE khachhang SET TenKH = N'${TenKH}', SDT = '${SDT}', DiaChi = N'${DiaChi}', MaST = '${MaST}' WHERE MaKH = '${MaKH}'`;
  const checkKhachhang = `SELECT COUNT(*) as count FROM khachhang WHERE MaKH = '${MaKH}'`;

  try {
    const recordExists = await checkUpdate(checkKhachhang);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [TenKH, SDT, DiaChi, MaST, MaKH]);
        res.json({ message: "Cập nhật khách hàng thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật khách hàng" });
  }
};

const deleteKhachhang = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM khachhang WHERE MaKH = '${id}'`;
  const checkKhachhang = `SELECT cOUNT(*) as count FROM khachhang WHERE MaKH = '${id}'`;
  try {
    const recordExists = await checkInsert(checkKhachhang);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy khách hàng" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa khách hàng thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllKhachhang,
  getKhachhangById,
  addKhachhang,
  updateKhachhang,
  deleteKhachhang,
};
