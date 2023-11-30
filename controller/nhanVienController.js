const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { checkUpdate, checkInsert, checkLogin } = require("../auth/checkInfo");

const getAllNhanvien = async (req, res) => {
  try {
    const oracleQuery =
      "SELECT MaNV,HoTen,GioiTinh,NgaySinh,nv.DiaChi as DiaChi,nv.SDT as SDT,nv.Email as Email,TenST FROM nhanvien nv inner join sieuthi st on st.MaST = nv.MaST";
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaNV: row[0],
        HoTen: row[1],
        GioiTinh: row[2],
        NgaySinh: row[3],
        DiaChi: row[4],
        SDT: row[5],
        Email: row[6],
        MaST: row[7],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getNhanvienById = async (req, res) => {
  try {
    const oracleQuery = `SELECT * FROM nhanvien WHERE MaNV = '${req.params.id}'`;
    const result = await executeOracleQuery(oracleQuery);
    const rows = result.rows;
    const jsonData = rows.map((row) => {
      return {
        MaNV: row[0],
        HoTen: row[1],
        GioiTinh: row[2],
        NgaySinh: row[3],
        DiaChi: row[4],
        SDT: row[5],
        Email: row[6],
        MaST: row[7],
      };
    });
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const addNhanvien = async (req, res) => {
  const { MaNV, HoTen, GioiTinh, NgaySinh, DiaChi, SDT, Email, MaST } =
    req.body;
  const oracleQuery =
    "INSERT INTO nhanvien (MaNV, HoTen, GioiTinh, NgaySinh, DiaChi, SDT, Email, MaST) VALUES (:1, :2, :3,TO_DATE(:4, 'yyyy-mm-dd'),:5, :6, :7, :8)";
  mySqlQuery = `INSERT INTO nhanvien VALUES('${MaNV}', N'${HoTen}', N'${GioiTinh}', '${NgaySinh}', N'${DiaChi}', '${SDT}', '${Email}', '${MaST}')`;
  const checkNhanvien = `SELECT cOUNT(*) as count FROM nhanvien WHERE MaNV = '${MaNV}'`;
  try {
    const recordExists = await checkInsert(checkNhanvien);
    if (recordExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.send({ message: "Lỗi khi thêm ở Server" });
      } else {
        executeOracleQuery(oracleQuery, [
          MaNV,
          HoTen,
          GioiTinh,
          NgaySinh,
          DiaChi,
          SDT,
          Email,
          MaST,
        ]);
        res.json({ message: "Thêm nhân viên mới thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi thêm nhân viên" });
  }
};

const updateNhanvien = async (req, res) => {
  const { MaNV, HoTen, GioiTinh, NgaySinh, DiaChi, SDT, Email, MaST } =
    req.body;
  const oracleQuery =
    "UPDATE nhanvien SET HoTen = :1, GioiTinh = :2, NgaySinh = TO_DATE(:3, 'yyyy-mm-dd'), DiaChi = :4, SDT = :5, Email = :6, MaST = :7 WHERE MaNV = :8";
  const mySqlQuery = `UPDATE nhanvien SET HoTen = N'${HoTen}', GioiTinh = N'${GioiTinh}', NgaySinh = '${NgaySinh}', DiaChi = N'${DiaChi}', SDT = '${SDT}', Email = '${Email}', MaST = '${MaST}' WHERE MaNV = '${MaNV}'`;
  const checkNhanvien = `SELECT COUNT(*) as count FROM nhanvien WHERE MaNV = '${MaNV}'`;

  try {
    const recordExists = await checkUpdate(checkNhanvien);
    if (!recordExists) {
      res.status(404).json({ message: "Không tìm thấy bản ghi để cập nhật" });
      return;
    }

    mysqlConnection.query(mySqlQuery, (mysqlError) => {
      if (mysqlError) {
        res.status(500).json({ message: "Lỗi khi cập nhật ở MySQL" });
      } else {
        executeOracleQuery(oracleQuery, [
          HoTen,
          GioiTinh,
          NgaySinh,
          DiaChi,
          SDT,
          Email,
          MaST,
          MaNV,
        ]);
        res.json({ message: "Cập nhật nhân viên thành công" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi cập nhật nhân viên" });
  }
};

const deleteNhanvien = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM nhanvien WHERE MaNV = '${id}'`;
  const checkNhanvien = `SELECT cOUNT(*) as count FROM nhanvien WHERE MaNV = '${id}'`;
  try {
    const recordExists = await checkInsert(checkNhanvien);
    if (!recordExists) {
      res.send({ message: "Không tìm thấy nhân viên" });
      return;
    }
    mysqlConnection.query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở Mysql" });
      } else {
        executeOracleQuery(deleteQuery);
        res.status(200).send({ message: "Xóa nhân viên thành công" });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

const nhanVienLogin = async (req, res) => {
  try {
    const checkTaiKhoan = `SELECT cOUNT(*) as count FROM taikhoan WHERE TenTk = '${req.body.taikhoan}' and MatKhau = '${req.body.matkhau}'`;
    const recordExists = await checkLogin(checkTaiKhoan);
    if (!recordExists) {
      res.send({ message: "Sai tên tài khoản hoặc mật khẩu" });
    } else {
      const userInfo = `select nv.MaNV as MaNV, HoTen,SDT,Email,Quyen from taikhoan tk inner join nhanvien nv on tk.MaNV = nv.MaNV where tk.TenTK = '${req.body.taikhoan}' and tk.MatKhau = '${req.body.matkhau}'`;
      const result = await executeOracleQuery(userInfo);
      const rows = result.rows;
      const jsonData = rows.map((row) => {
        return {
          MaNV: row[0],
          HoTen: row[1],
          SDT: row[2],
          Email: row[3],
          Quyen: row[4],
        };
      });
      res.json(jsonData);
    }
  } catch (error) {
    console.error(error);
    res.send({ message: "Lỗi trong quá trình đăng nhập" });
  }
};
module.exports = {
  getAllNhanvien,
  getNhanvienById,
  addNhanvien,
  updateNhanvien,
  deleteNhanvien,
  nhanVienLogin,
};
