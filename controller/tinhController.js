const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllTinh = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM tinh";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaTinh: row[0],
        TenTinh: row[1],
        KhuVuc: row[2],
        GhiChu: row[3],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getTinhById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM tinh where MaTinh = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaTinh: row[0],
        TenTinh: row[1],
        KhuVuc: row[2],
        GhiChu: row[3],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addTinh = async (req, res) => {
  const { MaTinh, TenTinh, KhuVuc, GhiChu } = req.body;
  const oracleQuery =
    "INSERT INTO tinh (MaTinh, TenTinh,KhuVuc, GhiChu) VALUES (:1, :2, :3, :4)";
  mySqlQuery = `INSERT INTO tinh VALUES('${MaTinh}', N'${TenTinh}', N'${KhuVuc}', N'${GhiChu}')`;
  const checkNHANHANG = `SELECT cOUNT(*) as count FROM tinh WHERE MaTinh = '${MaTinh}'`;
  try {
    const TKExists = await checkInsert(checkNHANHANG);
    if (TKExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaTinh, TenTinh, KhuVuc, GhiChu]);
        res.json({ message: "Thêm tỉnh mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm tỉnh" });
  }
};

const updateTinh = async (req, res) => {
  const { MaTinh, TenTinh, KhuVuc, GhiChu } = req.body;
  const oracleQuery =
    "UPDATE tinh SET TenTinh = :1, KhuVuc = :2, GhiChu = :3 WHERE MaTinh = :4";
  const mySqlQuery = `UPDATE tinh SET TenTinh = N'${TenTinh}', KhuVuc = N'${KhuVuc}', GhiChu = N'${GhiChu}' WHERE MaTinh = '${MaTinh}'`;
  const checkTinh = `SELECT COUNT(*) as count FROM tinh WHERE MaTinh = '${MaTinh}'`;

  try {
    const recordExists = await checkUpdate(checkTinh);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [TenTinh, KhuVuc, GhiChu, MaTinh]);
        res.json({ message: "Cập nhật tỉnh thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật tỉnh" });
  }
};

const deleteTinh = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM tinh WHERE MaTinh = '${id}'`;
  const checkTinh = `SELECT cOUNT(*) as count FROM tinh WHERE MaTinh = '${id}'`;
  try {
    const khExists = await checkInsert(checkTinh);
    if (!khExists) {
      res.send({ message: "Không tìm thấy tỉnh" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllTinh,
  getTinhById,
  addTinh,
  updateTinh,
  deleteTinh,
};
