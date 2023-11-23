const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllKhuyenmai = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM khuyenmai";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaKM: row[0],
        Ten: row[1],
        NoiDung: row[2],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getKhuyenmaiById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM khuyenmai WHERE MaKM = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaKM: row[0],
        Ten: row[1],
        NoiDung: row[2],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addKhuyenmai = async (req, res) => {
  const { MaKM, Ten, NoiDung } = req.body;
  const oracleQuery =
    "INSERT INTO khuyenmai (MaKM, Ten, NoiDung) VALUES (:1, :2, :3)";
  mySqlQuery = `INSERT INTO khuyenmai VALUES('${MaKM}', N'${Ten}', N'${NoiDung}')`;
  const checkKhuyenmai = `SELECT cOUNT(*) as count FROM khuyenmai WHERE MaKM = '${MaKM}'`;
  try {
    const recordExists = await checkInsert(checkKhuyenmai);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaKM, Ten, NoiDung]);
        res.json({ message: "Thêm khuyến mãi mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm khuyến mãi" });
  }
};

const updateKhuyenmai = async (req, res) => {
  const { MaKM, Ten, NoiDung } = req.body;
  const oracleQuery =
    "UPDATE khuyenmai SET Ten = :1, NoiDung = :2 WHERE MaKM = :3";
  const mySqlQuery = `UPDATE khuyenmai SET Ten = N'${Ten}', NoiDung = N'${NoiDung}' WHERE MaKM = '${MaKM}'`;
  const checkKhuyenmai = `SELECT COUNT(*) as count FROM khuyenmai WHERE MaKM = '${MaKM}'`;

  try {
    const recordExists = await checkUpdate(checkKhuyenmai);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [Ten, NoiDung, MaKM]);
        res.json({ message: "Cập nhật khuyến mãi thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật khuyến mãi" });
  }
};

const deleteKhuyenmai = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM khuyenmai WHERE MaKM = '${id}'`;
  const checkKhuyenmai = `SELECT cOUNT(*) as count FROM khuyenmai WHERE MaKM = '${id}'`;
  try {
    const recordExists = await checkInsert(checkKhuyenmai);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy khuyến mãi" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa khuyến mãi thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllKhuyenmai,
  getKhuyenmaiById,
  addKhuyenmai,
  updateKhuyenmai,
  deleteKhuyenmai,
};
