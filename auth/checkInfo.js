const { executeOracleQuery } = require("../config/connectOracle");
const { mysqlConnection } = require("../config/connectMysql");

const checkInsert = async (checkQuery) => {
  // console.log(checkQuery);
  return new Promise(async (resolve, reject) => {
    try {
      const oracleCheckResult = await executeOracleQuery(checkQuery);
      const oracleCount = oracleCheckResult.rows[0][0];
      mysqlConnection.query(checkQuery, (mysqlError, mysqlResults) => {
        if (mysqlError) {
          reject(mysqlError);
          return;
        }

        const mysqlCount = mysqlResults[0].count;

        console.log("mysql: " + mysqlCount);
        console.log("ora: " + oracleCount);
        if (oracleCount > 0 || mysqlCount > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const checkLogin = async (checkQuery) => {
  // console.log(checkQuery);
  return new Promise(async (resolve, reject) => {
    try {
      const oracleCheckResult = await executeOracleQuery(checkQuery);
      const oracleCount = oracleCheckResult.rows[0][0];
      mysqlConnection.query(checkQuery, (mysqlError, mysqlResults) => {
        if (mysqlError) {
          reject(mysqlError);
          return;
        }

        const mysqlCount = mysqlResults[0].count;

        console.log("mysql: " + mysqlCount);
        console.log("ora: " + oracleCount);
        if (oracleCount > 0 && mysqlCount > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const checkUpdate = async (checkQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const oracleCheckResult = await executeOracleQuery(checkQuery);
      const oracleCount = oracleCheckResult.rows[0][0];

      mysqlConnection.query(checkQuery, (mysqlError, mysqlResults) => {
        if (mysqlError) {
          reject(mysqlError);
          return;
        }

        const mysqlCount = mysqlResults[0].count;
        console.log("mysql: " + mysqlCount);
        console.log("ora: " + oracleCount);
        // Kiểm tra kết quả trên cả hai cơ sở dữ liệu
        if (oracleCount > 0 && mysqlCount > 0) {
          resolve(true);
        } else if (oracleCount == 0 && mysqlCount > 0) {
          resolve(false);
        } else {
          resolve(false);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { checkInsert, checkUpdate, checkLogin };
