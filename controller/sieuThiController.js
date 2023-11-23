const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllSieuthi = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM sieuthi";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaST: row[0],
        TenST: row[1],
        DiaChi: row[2],
        SDT: row[3],
        Email: row[4],
        MaCN: row[5],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getSieuthiById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM sieuthi WHERE MaST = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaST: row[0],
        TenST: row[1],
        DiaChi: row[2],
        SDT: row[3],
        Email: row[4],
        MaCN: row[5],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addSieuthi = async (req, res) => {
  const { MaST, TenST, DiaChi, SDT, Email, MaCN } = req.body;
  const oracleQuery =
    "INSERT INTO sieuthi (MaST, TenST, DiaChi, SDT, Email, MaCN) VALUES (:1, :2, :3, :4, :5, :6)";
  mySqlQuery = `INSERT INTO sieuthi VALUES('${MaST}', N'${TenST}', N'${DiaChi}', '${SDT}', '${Email}', '${MaCN}')`;
  const checkSieuthi = `SELECT cOUNT(*) as count FROM sieuthi WHERE MaST = '${MaST}'`;
  try {
    const recordExists = await checkInsert(checkSieuthi);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaST, TenST, DiaChi, SDT, Email, MaCN]);
        res.json({ message: "Thêm siêu thị mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm siêu thị" });
  }
};

const updateSieuthi = async (req, res) => {
  const { MaST, TenST, DiaChi, SDT, Email, MaCN } = req.body;
  const oracleQuery =
    "UPDATE sieuthi SET TenST = :1, DiaChi = :2, SDT = :3, Email = :4, MaCN = :5 WHERE MaST = :6";
  const mySqlQuery = `UPDATE sieuthi SET TenST = N'${TenST}', DiaChi = N'${DiaChi}', SDT = '${SDT}', Email = '${Email}', MaCN = '${MaCN}' WHERE MaST = '${MaST}'`;
  const checkSieuthi = `SELECT COUNT(*) as count FROM sieuthi WHERE MaST = '${MaST}'`;

  try {
    const recordExists = await checkUpdate(checkSieuthi);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [TenST, DiaChi, SDT, Email, MaCN, MaST]);
        res.json({ message: "Cập nhật siêu thị thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật siêu thị" });
  }
};

const deleteSieuthi = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM sieuthi WHERE MaST = '${id}'`;
  const checkSieuthi = `SELECT cOUNT(*) as count FROM sieuthi WHERE MaST = '${id}'`;
  try {
    const recordExists = await checkInsert(checkSieuthi);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy siêu thị" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa siêu thị thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllSieuthi,
  getSieuthiById,
  addSieuthi,
  updateSieuthi,
  deleteSieuthi,
};
