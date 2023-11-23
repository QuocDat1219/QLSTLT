const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllDanhmucHH = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM danhmuchh";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaDanhMuc: row[0],
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

const getDanhmucHHById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM danhmuchh WHERE MaDanhMuc = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaDanhMuc: row[0],
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

const addDanhmucHH = async (req, res) => {
  const { MaDanhMuc, Ten, GhiChu } = req.body;
  const oracleQuery =
    "INSERT INTO danhmuchh (MaDanhMuc, Ten, GhiChu) VALUES (:1, :2, :3)";
  mySqlQuery = `INSERT INTO danhmuchh VALUES('${MaDanhMuc}', N'${Ten}', N'${GhiChu}')`;
  const checkDanhmucHH = `SELECT cOUNT(*) as count FROM danhmuchh WHERE MaDanhMuc = '${MaDanhMuc}'`;
  try {
    const recordExists = await checkInsert(checkDanhmucHH);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaDanhMuc, Ten, GhiChu]);
        res.json({ message: "Thêm danh mục hàng hóa mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm danh mục hàng hóa" });
  }
};

const updateDanhmucHH = async (req, res) => {
  const { MaDanhMuc, Ten, GhiChu } = req.body;
  const oracleQuery =
    "UPDATE danhmuchh SET Ten = :1, GhiChu = :2 WHERE MaDanhMuc = :3";
  const mySqlQuery = `UPDATE danhmuchh SET Ten = N'${Ten}', GhiChu = N'${GhiChu}' WHERE MaDanhMuc = '${MaDanhMuc}'`;
  const checkDanhmucHH = `SELECT COUNT(*) as count FROM danhmuchh WHERE MaDanhMuc = '${MaDanhMuc}'`;

  try {
    const recordExists = await checkUpdate(checkDanhmucHH);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [Ten, GhiChu, MaDanhMuc]);
        res.json({ message: "Cập nhật danh mục hàng hóa thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật danh mục hàng hóa" });
  }
};

const deleteDanhmucHH = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM danhmuchh WHERE MaDanhMuc = '${id}'`;
  const checkDanhmucHH = `SELECT cOUNT(*) as count FROM danhmuchh WHERE MaDanhMuc = '${id}'`;
  try {
    const recordExists = await checkInsert(checkDanhmucHH);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy danh mục hàng hóa" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa danh mục hàng hóa thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllDanhmucHH,
  getDanhmucHHById,
  addDanhmucHH,
  updateDanhmucHH,
  deleteDanhmucHH,
};
