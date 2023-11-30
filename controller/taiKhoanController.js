const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");
const bcrypt = require("bcrypt");

const getAllTaikhoan = async (req, res) => {
  try {
    const oracleQuery = `SELECT tk.TenTK as TenTK, nv.HoTen as MaNV, tk.Matkhau as Matkhau, tk.Quyen as Quyen
      FROM taikhoan tk
      INNER JOIN nhanvien nv ON tk.MaNV = nv.MaNV`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;

    const jsonData = rows.map((row) => {
      const password = bcrypt.hashSync(row[2], 10);
      return {
        TenTK: row[0],
        MaNV: row[1],
        Matkhau: password,
        Quyen: row[3],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getTaikhoanById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM taikhoan WHERE TenTK = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        TenTK: row[0],
        MaNV: row[1],
        Matkhau: row[2],
        Quyen: row[3],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addTaikhoan = async (req, res) => {
  const { TenTK, MaNV, Matkhau, Quyen } = req.body;
  const oracleQuery =
    "INSERT INTO taikhoan (TenTK, MaNV, Matkhau, Quyen) VALUES (:1, :2, :3, :4)";
  mySqlQuery = `INSERT INTO taikhoan VALUES('${TenTK}', '${MaNV}', '${Matkhau}', '${Quyen}')`;
  const checkTaikhoan = `SELECT COUNT(*) as count FROM taikhoan WHERE TenTK = '${TenTK}' OR MaNV = '${MaNV}'`;
  try {
    const recordExists = await checkInsert(checkTaikhoan);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        console.error(mysqlError);
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [TenTK, MaNV, Matkhau, Quyen]);
        res.json({ message: "Thêm tài khoản mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm tài khoản" });
  }
};

const updateTaikhoan = async (req, res) => {
  const { TenTK, MaNV, Matkhau, Quyen } = req.body;
  console.log(Quyen);
  const oracleQuery =
    "UPDATE taikhoan SET MaNV = :2, Matkhau = :3, Quyen = :4 WHERE TenTK = :1";
  const mySqlQuery = `UPDATE taikhoan SET MaNV = '${MaNV}', Matkhau = '${Matkhau}', Quyen = ${Quyen} WHERE TenTK = '${TenTK}'`;
  const checkTaikhoan = `SELECT COUNT(*) as count FROM taikhoan WHERE TenTK = '${TenTK}' AND MaNV = '${MaNV}'`;
  console.log(mySqlQuery);
  try {
    const recordExists = await checkUpdate(checkTaikhoan);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [MaNV, Matkhau, Quyen, TenTK]);
        res.json({ message: "Cập nhật tài khoản thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật tài khoản" });
  }
};

const deleteTaikhoan = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const deleteQuery = `DELETE FROM taikhoan WHERE TenTK = '${id}'`;
  const checkTaikhoan = `SELECT COUNT(*) as count FROM taikhoan WHERE TenTK = '${id}'`;
  try {
    const recordExists = await checkInsert(checkTaikhoan);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy tài khoản" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa tài khoản thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllTaikhoan,
  getTaikhoanById,
  addTaikhoan,
  updateTaikhoan,
  deleteTaikhoan,
};
