const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");

const getAllChiNhanh = async (req, res) => {
  try {
    const oracleQuery = "SELECT * FROM chinhanh";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaCN: row[0],
        TenCN: row[1],
        DiaChi: row[2],
        MaTinh: row[2],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

module.exports = {
  getAllChiNhanh,
};
