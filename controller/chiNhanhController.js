const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllChinhanh = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM chinhanh";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaCN: row[0],
        TenCN: row[1],
        DiaChi: row[2],
        MaTinh: row[3],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getChinhanhById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM chinhanh where MaCN = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaCN: row[0],
        TenCN: row[1],
        DiaChi: row[2],
        MaTinh: row[3],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addChinhanh = async (req, res) => {
  const { MaCN, TenCN, DiaChi, MaTinh } = req.body;
  const oracleQuery =
    "INSERT INTO chinhanh (MaCN, TenCN, DiaChi, MaTinh) VALUES (:1, :2, :3, :4)";
  mySqlQuery = `INSERT INTO chinhanh VALUES('${MaCN}', N'${TenCN}', N'${DiaChi}', '${MaTinh}')`;
  const checkChinhanh = `SELECT cOUNT(*) as count FROM chinhanh WHERE MaCN = '${MaCN}'`;
  try {
    const recordExists = await checkInsert(checkChinhanh);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaCN, TenCN, DiaChi, MaTinh]);
        res.json({ message: "Thêm chi nhánh mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm chi nhánh" });
  }
};

const updateChinhanh = async (req, res) => {
  const { MaCN, TenCN, DiaChi, MaTinh } = req.body;
  const oracleQuery =
    "UPDATE chinhanh SET TenCN = :1, DiaChi = :2, MaTinh = :3 WHERE MaCN = :4";
  const mySqlQuery = `UPDATE chinhanh SET TenCN = N'${TenCN}', DiaChi = N'${DiaChi}', MaTinh = '${MaTinh}' WHERE MaCN = '${MaCN}'`;
  const checkChinhanh = `SELECT COUNT(*) as count FROM chinhanh WHERE MaCN = '${MaCN}'`;

  try {
    const recordExists = await checkUpdate(checkChinhanh);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [TenCN, DiaChi, MaTinh, MaCN]);
        res.json({ message: "Cập nhật chi nhánh thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật chi nhánh" });
  }
};

const deleteChinhanh = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM chinhanh WHERE MaCN = '${id}'`;
  const checkChinhanh = `SELECT cOUNT(*) as count FROM chinhanh WHERE MaCN = '${id}'`;
  try {
    const recordExists = await checkInsert(checkChinhanh);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy chi nhánh" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa chi nhánh thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllChinhanh,
  getChinhanhById,
  addChinhanh,
  updateChinhanh,
  deleteChinhanh,
};
