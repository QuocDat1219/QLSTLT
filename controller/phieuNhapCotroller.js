const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllPhieunhap = async (req, res) => {
  try {
    const oracleQuery =
      "select MaPN, NgayNhap, GhiChu, HoTen, TenST from phieunhapkho pn inner join nhanvien nv on pn.MaNV = nv.MaNV inner join sieuthi st on st.MaST = pn.MaST";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaPN: row[0],
        NgayNhap: row[1],
        GhiChu: row[2],
        NhanVien: row[3],
        SieuThi: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getPhieunhapById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM phieunhapkho WHERE MaPN = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaPN: row[0],
        NgayNhap: row[1],
        GhiChu: row[2],
        MaNV: row[3],
        MaST: row[4],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addPhieunhap = async (req, res) => {
  const { MaPN, NgayNhap, GhiChu, MaNV, MaST } = req.body;
  const oracleQuery =
    "INSERT INTO phieunhapkho (MaPN, NgayNhap, GhiChu, MaNV, MaST) VALUES (:1,TO_DATE(:2, 'yyyy-mm-dd'), :3, :4, :5)";
  mySqlQuery = `INSERT INTO phieunhapkho VALUES('${MaPN}', '${NgayNhap}', N'${GhiChu}', '${MaNV}', '${MaST}')`;
  const checkPhieunhap = `SELECT cOUNT(*) as count FROM phieunhapkho WHERE MaPN = '${MaPN}'`;
  try {
    const recordExists = await checkInsert(checkPhieunhap);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [MaPN, NgayNhap, GhiChu, MaNV, MaST]);
        res.json({ message: "Thêm phiếu nhập mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm phiếu nhập" });
  }
};

const updatePhieunhap = async (req, res) => {
  const { MaPN, NgayNhap, GhiChu, MaNV, MaST } = req.body;
  const oracleQuery =
    "UPDATE phieunhapkho SET NgayNhap = TO_DATE(:1, 'yyyy-mm-dd'), GhiChu = :2, MaNV = :3, MaST = :4 WHERE MaPN = :5";
  const mySqlQuery = `UPDATE phieunhapkho SET NgayNhap = '${NgayNhap}', GhiChu = N'${GhiChu}', MaNV = '${MaNV}', MaST = '${MaST}' WHERE MaPN = '${MaPN}'`;
  const checkPhieunhap = `SELECT COUNT(*) as count FROM phieunhapkho WHERE MaPN = '${MaPN}'`;

  try {
    const recordExists = await checkUpdate(checkPhieunhap);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [NgayNhap, GhiChu, MaNV, MaST, MaPN]);
        res.json({ message: "Cập nhật phiếu nhập thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật phiếu nhập" });
  }
};

const deletePhieunhap = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM phieunhapkho WHERE MaPN = '${id}'`;
  const checkPhieunhap = `SELECT cOUNT(*) as count FROM phieunhapkho WHERE MaPN = '${id}'`;
  try {
    const recordExists = await checkInsert(checkPhieunhap);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy phiếu nhập" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa phiếu nhập thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllPhieunhap,
  getPhieunhapById,
  addPhieunhap,
  updatePhieunhap,
  deletePhieunhap,
};
