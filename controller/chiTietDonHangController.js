const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllCtdonhang = async (req, res) => {
  try {
    const oracleQuery =
      `select *  from  ctdonhang `;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaDH: row[0],
        MaHH: row[1],
        SL: row[2],
        DVT: row[3],
        ThanhTien: row[4],
        TenHH: row[5],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getCtdonhangById = async (req, res) => {
  try {
    const oracleQuery = `SELECT ct.*, hh.TenHH FROM ctdonhang ct , hanghoa hh  WHERE ct.MaHH = hh.MaHH and MaDH = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaDH: row[0],
        MaHH: row[1],
        SL: row[2],
        DVT: row[3],
        ThanhTien: row[4],
        TenHH: row[5],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getCtdonhangByDeTail = async (req, res) => {
  const mahh = req.query.mahh;
  const madh = req.query.madh;
  console.log(mahh, madh);
  try {
    const oracleQuery = `SELECT * FROM ctdonhang WHERE MaDH = '${madh}' and MaHH = '${mahh}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaDH: row[0],
        MaHH: row[1],
        SL: row[2],
        DVT: row[3],
        ThanhTien: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addCtdonhang = async (req, res) => {
  const { MaDH, MaHH, SL, DVT, ThanhTien } = req.body;
  const oracleQuery =
    "INSERT INTO ctdonhang (MaDH, MaHH, SL, DVT, ThanhTien) VALUES (:1, :2, :3, :4, :5)";
  mySqlQuery = `INSERT INTO ctdonhang VALUES('${MaDH}', '${MaHH}', '${SL}', N'${DVT}', '${ThanhTien}')`;
  const checkCtdonhang = `SELECT cOUNT(*) as count FROM ctdonhang WHERE MaDH = '${MaDH}' AND MaHH = '${MaHH}'`;
  try {
    const recordExists = await checkInsert(checkCtdonhang);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        console.error(mysqlError);
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaDH, MaHH, SL, DVT, ThanhTien]);
        res.json({ message: "Thêm chi tiết đơn hàng mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm chi tiết đơn hàng" });
  }
};

const updateCtdonhang = async (req, res) => {
  const { MaDH, MaHH, SL, DVT, ThanhTien,idMaHH } = req.body;
  const oracleQuery =
    `UPDATE ctdonhang SET SL = :1, DVT = :2, ThanhTien = :3 , MaHH = :4  WHERE MaDH = '${MaDH}' AND MaHH = '${idMaHH}'`;
  const mySqlQuery = `UPDATE ctdonhang SET  MaHH='${MaHH}', SL = '${SL}', DVT = N'${DVT}', ThanhTien = '${ThanhTien}' WHERE MaDH = '${MaDH}' AND MaHH = '${idMaHH}'`;
console.log(mySqlQuery)
  try {
  
    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [SL, DVT, ThanhTien, MaHH]);
        res.json({ message: "Cập nhật chi tiết đơn hàng thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật chi tiết đơn hàng" });
  }
};

const deleteCtdonhang = async (req, res) => {
  const { MaDH, MaHH } = req.body;
  const deleteQuery = `DELETE FROM ctdonhang WHERE MaDH = '${MaDH}' AND MaHH = '${MaHH}'`;
  const checkCtdonhang = `SELECT cOUNT(*) as count FROM ctdonhang WHERE MaDH = '${MaDH}' AND MaHH = '${MaHH}'`;
  try {
    const recordExists = await checkInsert(checkCtdonhang);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy chi tiết đơn hàng" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa chi tiết đơn hàng thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllCtdonhang,
  getCtdonhangById,
  addCtdonhang,
  updateCtdonhang,
  deleteCtdonhang,
  getCtdonhangByDeTail,
};
