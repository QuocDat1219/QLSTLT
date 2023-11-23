const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllNhanhang = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM nhanhang";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaNhanHang: row[0],
        Ten: row[1],
        GhiChu: row[2],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getNhanhangById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM nhanhang WHERE MaNhanHang = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaNhanHang: row[0],
        Ten: row[1],
        GhiChu: row[2],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addNhanhang = async (req, res) => {
  const { MaNhanHang, Ten, GhiChu } = req.body;
  const oracleQuery =
    "INSERT INTO nhanhang (MaNhanHang, Ten, GhiChu) VALUES (:1, :2, :3)";
  mySqlQuery = `INSERT INTO nhanhang VALUES('${MaNhanHang}', N'${Ten}', N'${GhiChu}')`;
  const checkNhanhang = `SELECT cOUNT(*) as count FROM nhanhang WHERE MaNhanHang = '${MaNhanHang}'`;
  try {
    const recordExists = await checkInsert(checkNhanhang);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaNhanHang, Ten, GhiChu]);
        res.json({ message: "Thêm nhãn hàng mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm nhãn hàng" });
  }
};

const updateNhanhang = async (req, res) => {
  const { MaNhanHang, Ten, GhiChu } = req.body;
  const oracleQuery =
    "UPDATE nhanhang SET Ten = :1, GhiChu = :2 WHERE MaNhanHang = :3";
  const mySqlQuery = `UPDATE nhanhang SET Ten = N'${Ten}', GhiChu = N'${GhiChu}' WHERE MaNhanHang = '${MaNhanHang}'`;
  const checkNhanhang = `SELECT COUNT(*) as count FROM nhanhang WHERE MaNhanHang = '${MaNhanHang}'`;

  try {
    const recordExists = await checkUpdate(checkNhanhang);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [Ten, GhiChu, MaNhanHang]);
        res.json({ message: "Cập nhật nhãn hàng thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật nhãn hàng" });
  }
};

const deleteNhanhang = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM nhanhang WHERE MaNhanHang = '${id}'`;
  const checkNhanhang = `SELECT cOUNT(*) as count FROM nhanhang WHERE MaNhanHang = '${id}'`;
  try {
    const recordExists = await checkInsert(checkNhanhang);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy nhãn hàng" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa nhãn hàng thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllNhanhang,
  getNhanhangById,
  addNhanhang,
  updateNhanhang,
  deleteNhanhang,
};
