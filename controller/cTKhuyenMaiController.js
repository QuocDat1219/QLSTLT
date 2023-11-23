const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllCtkhuyenmai = async (req, res) => {
  try {
    const oracleQuery = `select ct.MaKM as MaKM,Ten, NoiDung, TenHH, MucGiam, NgayApDung,NgayHetHan from ctkhuyenmai ct 
    inner join khuyenmai km on ct.makm = km.makm
    inner join hanghoa hh on hh.mahh = ct.mahh
    `;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaKM: row[0],
        Ten: row[1],
        NoiDung: row[2],
        TenHH: row[3],
        MucGiam: row[4],
        NgayApDung: row[5],
        NgayHetHan: row[6],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getCtkhuyenmaiById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM ctkhuyenmai WHERE MaKM = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaKM: row[0],
        MucGiam: row[1],
        NgayApDung: row[2],
        NgayHetHan: row[3],
        MaHH: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getCtkhuyenmaiByDetails = async (req, res) => {
  const maHH = req.query.maHH;
  const maKM = req.query.maKM;
  try {
    const oracleQuery = `SELECT * FROM ctkhuyenmai WHERE MaKM = '${maKM}' and MaHH = '${maHH}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaKM: row[0],
        MucGiam: row[1],
        NgayApDung: row[2],
        NgayHetHan: row[3],
        MaHH: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addCtkhuyenmai = async (req, res) => {
  const { MaKM, MucGiam, NgayApDung, NgayHetHan, MaHH } = req.body;
  const oracleQuery =
    "INSERT INTO ctkhuyenmai (MaKM, MucGiam, NgayApDung, NgayHetHan, MaHH) VALUES (:1, :2, TO_DATE(:3, 'yyyy-mm-dd'), TO_DATE(:4, 'yyyy-mm-dd'), :5)";
  mySqlQuery = `INSERT INTO ctkhuyenmai VALUES('${MaKM}', '${MucGiam}', '${NgayApDung}', '${NgayHetHan}', '${MaHH}')`;
  const checkCtkhuyenmai = `SELECT COUNT(*) as count FROM ctkhuyenmai WHERE MaKM = '${MaKM}' AND MaHH = '${MaHH}'`;
  try {
    const recordExists = await checkInsert(checkCtkhuyenmai);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        console.error(mysqlError);
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [
          MaKM,
          MucGiam,
          NgayApDung,
          NgayHetHan,
          MaHH,
        ]);
        res.json({ message: "Thêm chi tiết khuyến mãi mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm chi tiết khuyến mãi" });
  }
};

const updateCtkhuyenmai = async (req, res) => {
  const { MaKM, MucGiam, NgayApDung, NgayHetHan, MaHH } = req.body;
  console.log(MucGiam);
  const oracleQuery = `UPDATE ctkhuyenmai SET MucGiam = :1, NgayApDung = TO_DATE(:2, 'yyyy-mm-dd'), NgayHetHan = TO_DATE(:3, 'yyyy-mm-dd') WHERE MaKM = '${MaKM}' AND MaHH = '${MaHH}'`;
  const mySqlQuery = `UPDATE ctkhuyenmai SET MucGiam = '${MucGiam}', NgayApDung = '${NgayApDung}', NgayHetHan = '${NgayHetHan}' WHERE MaKM = '${MaKM}' AND MaHH = '${MaHH}'`;
  const checkCtkhuyenmai = `SELECT COUNT(*) as count FROM ctkhuyenmai WHERE MaKM = '${MaKM}' AND MaHH = '${MaHH}'`;

  try {
    const recordExists = await checkUpdate(checkCtkhuyenmai);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }
    console.log(oracleQuery);

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [MucGiam, NgayApDung, NgayHetHan]);
        res.json({ message: "Cập nhật chi tiết khuyến mãi thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật chi tiết khuyến mãi" });
  }
};

const deleteCtkhuyenmai = async (req, res) => {
  const { MaKM, MaHH } = req.params;
  const deleteQuery = `DELETE FROM ctkhuyenmai WHERE MaKM = '${MaKM}' AND MaHH = '${MaHH}'`;
  const checkCtkhuyenmai = `SELECT COUNT(*) as count FROM ctkhuyenmai WHERE MaKM = '${MaKM}' AND MaHH = '${MaHH}'`;
  try {
    const recordExists = await checkInsert(checkCtkhuyenmai);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy chi tiết khuyến mãi" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa chi tiết khuyến mãi thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllCtkhuyenmai,
  getCtkhuyenmaiById,
  addCtkhuyenmai,
  updateCtkhuyenmai,
  deleteCtkhuyenmai,
  getCtkhuyenmaiByDetails,
};
