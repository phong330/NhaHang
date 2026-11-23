using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Google.Apis.Auth;
using RestaurantApi.Services;

namespace RestaurantApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly IConfiguration _cfg;
        private string GoogleClientId => _cfg["Authentication:Google:ClientId"] ?? _cfg["GoogleSettings:ClientId"] ?? "596669911736-08pl881v6paa1cnb3pu65k2unav8s05h.apps.googleusercontent.com";

        public TaiKhoanController(IConfiguration cfg) { _cfg = cfg; }

        // GET /api/TaiKhoan
        [HttpGet]
        public IActionResult LayTatCa()
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { thongBao = "Chỉ Quản trị viên mới được xem danh sách tài khoản!" });

            var ds = new List<object>();
            using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
            conn.Open();
            using var cmd = new SqlCommand("SELECT Id,HoTen,Email,SoDienThoai,VaiTro,TrangThai FROM TaiKhoan ORDER BY Id DESC", conn);
            using var r = cmd.ExecuteReader();
            while (r.Read())
                ds.Add(new {
                    id = r["Id"],
                    hoTen = r["HoTen"],
                    email = r["Email"],
                    soDienThoai = r["SoDienThoai"],
                    vaiTro = r["VaiTro"],
                    trangThai = r["TrangThai"] != DBNull.Value ? r["TrangThai"] : "HoatDong"
                });
            return Ok(ds);
        }

        // POST /api/TaiKhoan - Admin tạo tài khoản mới (Staff, Customer, Admin)
        [HttpPost]
        public IActionResult TaoTaiKhoanAdmin([FromBody] TaoTaiKhoanDto dto)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { message = "Chỉ Quản trị viên mới được tạo tài khoản nội bộ!" });

            if (string.IsNullOrWhiteSpace(dto.HoTen) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { message = "Họ tên và email là bắt buộc!" });

            using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
            conn.Open();
            string email = dto.Email.Trim().ToLower();

            using var check = new SqlCommand("SELECT COUNT(*) FROM TaiKhoan WHERE LOWER(LTRIM(RTRIM(Email)))=@Email", conn);
            check.Parameters.AddWithValue("@Email", email);
            if (Convert.ToInt32(check.ExecuteScalar()) > 0)
                return BadRequest(new { message = "Email đã tồn tại!" });

            string vaiTro = dto.VaiTro is "Admin" or "Staff" or "Customer" ? dto.VaiTro : "Customer";
            string matKhau = string.IsNullOrWhiteSpace(dto.MatKhau) ? "123456" : dto.MatKhau.Trim();

            using var cmd = new SqlCommand(@"INSERT INTO TaiKhoan(HoTen,Email,SoDienThoai,MatKhau,VaiTro,TrangThai)
                OUTPUT INSERTED.Id VALUES(@HoTen,@Email,@SDT,@MK,@VaiTro,N'HoatDong')", conn);
            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen.Trim());
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@SDT", dto.SoDienThoai?.Trim() ?? "");
            cmd.Parameters.AddWithValue("@MK", matKhau);
            cmd.Parameters.AddWithValue("@VaiTro", vaiTro);
            int id = Convert.ToInt32(cmd.ExecuteScalar());

            return Ok(new { message = "Tạo tài khoản thành công!", id });
        }

        // PUT /api/TaiKhoan/{id} - Admin cập nhật thông tin và phân quyền tài khoản
        [HttpPut("{id}")]
        public IActionResult CapNhatTaiKhoan(int id, [FromBody] CapNhatTaiKhoanDto dto)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { message = "Chỉ Quản trị viên mới có quyền cập nhật và phân quyền tài khoản!" });

            int currentUserId = AuthHelper.LayUserId(Request);
            // Không cho phép tự hạ quyền của chính mình nếu là Admin
            if (currentUserId == id && dto.VaiTro != "Admin")
                return BadRequest(new { message = "Bạn không thể tự hạ quyền Admin của chính mình!" });

            using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
            conn.Open();

            string vaiTro = dto.VaiTro is "Admin" or "Staff" or "Customer" ? dto.VaiTro : "Customer";
            string sql = @"UPDATE TaiKhoan 
                           SET HoTen = @HoTen, SoDienThoai = @SDT, VaiTro = @VaiTro 
                           WHERE Id = @Id";

            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen.Trim());
            cmd.Parameters.AddWithValue("@SDT", dto.SoDienThoai?.Trim() ?? "");
            cmd.Parameters.AddWithValue("@VaiTro", vaiTro);

            int rows = cmd.ExecuteNonQuery();
            if (rows == 0) return NotFound(new { message = "Không tìm thấy tài khoản!" });

            return Ok(new { message = "Cập nhật và phân quyền thành công!" });
        }

        // PATCH /api/TaiKhoan/{id}/trang-thai - Admin Khóa / Mở khóa tài khoản
        [HttpPatch("{id}/trang-thai")]
        public IActionResult DoiTrangThaiKhoa(int id, [FromBody] DoiTrangThaiTkDto dto)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { message = "Chỉ Quản trị viên mới có quyền khóa/mở khóa tài khoản!" });

            int currentUserId = AuthHelper.LayUserId(Request);
            if (currentUserId == id)
                return BadRequest(new { message = "Bạn không thể tự khóa tài khoản của chính mình!" });

            using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
            conn.Open();

            string tt = dto.TrangThai == "BiKhoa" ? "BiKhoa" : "HoatDong";
            using var cmd = new SqlCommand("UPDATE TaiKhoan SET TrangThai = @TT WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@TT", tt);

            int rows = cmd.ExecuteNonQuery();
            if (rows == 0) return NotFound(new { message = "Không tìm thấy tài khoản!" });

            return Ok(new { message = tt == "BiKhoa" ? "Đã khóa tài khoản thành công!" : "Đã mở khóa tài khoản thành công!", trangThai = tt });
        }

        // PUT /api/TaiKhoan/{id}/thong-tin - Khách hàng cập nhật thông tin cá nhân của mình
        [HttpPut("{id}/thong-tin")]
        public IActionResult CapNhatThongTinCaNhan(int id, [FromBody] ThongTinCaNhanDto dto)
        {
            int currentUserId = AuthHelper.LayUserId(Request);
            if (currentUserId != id && !AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { message = "Bạn chỉ có thể cập nhật thông tin của chính mình!" });

            using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
            conn.Open();

            using var cmd = new SqlCommand("UPDATE TaiKhoan SET HoTen = @HoTen, SoDienThoai = @SDT WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen.Trim());
            cmd.Parameters.AddWithValue("@SDT", dto.SoDienThoai?.Trim() ?? "");

            int rows = cmd.ExecuteNonQuery();
            if (rows == 0) return NotFound(new { message = "Không tìm thấy tài khoản!" });

            return Ok(new { message = "Cập nhật thông tin cá nhân thành công!" });
        }

        // POST /api/TaiKhoan/dang-ky
        [HttpPost("dang-ky")]
        public IActionResult DangKy([FromBody] DangKyDto dto)
        {
            using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
            conn.Open();
            string email = dto.Email.Trim().ToLower();

            using var check = new SqlCommand("SELECT COUNT(*) FROM TaiKhoan WHERE LOWER(LTRIM(RTRIM(Email)))=@Email", conn);
            check.Parameters.AddWithValue("@Email", email);
            if (Convert.ToInt32(check.ExecuteScalar()) > 0)
                return BadRequest(new { message = "Email đã tồn tại!" });

            using var cmd = new SqlCommand(@"INSERT INTO TaiKhoan(HoTen,Email,SoDienThoai,MatKhau,VaiTro,TrangThai)
                OUTPUT INSERTED.Id VALUES(@HoTen,@Email,@SDT,@MK,N'Customer',N'HoatDong')", conn);
            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen.Trim());
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@SDT", dto.SoDienThoai?.Trim() ?? "");
            cmd.Parameters.AddWithValue("@MK", dto.MatKhau.Trim());
            int id = Convert.ToInt32(cmd.ExecuteScalar());
            return Ok(new { message = "Đăng ký thành công!", id });
        }

        // POST /api/TaiKhoan/dang-nhap
        [HttpPost("dang-nhap")]
        public IActionResult DangNhap([FromBody] DangNhapDto dto)
        {
            using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
            conn.Open();
            using var cmd = new SqlCommand(@"SELECT Id,HoTen,Email,SoDienThoai,VaiTro,TrangThai FROM TaiKhoan
                WHERE LOWER(LTRIM(RTRIM(Email)))=@Email AND LTRIM(RTRIM(MatKhau))=@MK", conn);
            cmd.Parameters.AddWithValue("@Email", dto.Email.Trim().ToLower());
            cmd.Parameters.AddWithValue("@MK", dto.MatKhau.Trim());
            using var r = cmd.ExecuteReader();
            if (r.Read())
            {
                string trangThai = r["TrangThai"] != DBNull.Value ? r["TrangThai"].ToString()! : "HoatDong";
                if (trangThai == "BiKhoa")
                {
                    return Unauthorized(new { message = "Tài khoản của bạn đã bị khóa bởi Quản trị viên! Vui lòng liên hệ nhà hàng để được hỗ trợ." });
                }

                return Ok(new {
                    message = "Đăng nhập thành công!",
                    user = new {
                        id = r["Id"],
                        hoTen = r["HoTen"],
                        email = r["Email"],
                        soDienThoai = r["SoDienThoai"],
                        vaiTro = r["VaiTro"],
                        trangThai = trangThai
                    }
                });
            }
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
        }

        // POST /api/TaiKhoan/dang-nhap-google
        [HttpPost("dang-nhap-google")]
        public async Task<IActionResult> DangNhapGoogle([FromBody] GoogleDto dto)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken,
                    new GoogleJsonWebSignature.ValidationSettings { Audience = new[] { GoogleClientId } });
                string email = payload.Email.Trim().ToLower();
                string hoTen = string.IsNullOrWhiteSpace(payload.Name) ? email : payload.Name;

                using var conn = new SqlConnection(_cfg.GetConnectionString("NhaHangDb"));
                conn.Open();
                using var find = new SqlCommand("SELECT Id,HoTen,Email,SoDienThoai,VaiTro,TrangThai FROM TaiKhoan WHERE LOWER(LTRIM(RTRIM(Email)))=@Email", conn);
                find.Parameters.AddWithValue("@Email", email);
                using var r = find.ExecuteReader();
                if (r.Read())
                {
                    string trangThai = r["TrangThai"] != DBNull.Value ? r["TrangThai"].ToString()! : "HoatDong";
                    if (trangThai == "BiKhoa")
                    {
                        return Unauthorized(new { message = "Tài khoản của bạn đã bị khóa bởi Quản trị viên!" });
                    }
                    return Ok(new { message = "Đăng nhập Google thành công!", user = new { id = r["Id"], hoTen = r["HoTen"], email = r["Email"], soDienThoai = r["SoDienThoai"], vaiTro = r["VaiTro"], trangThai = trangThai } });
                }
                r.Close();

                using var ins = new SqlCommand(@"INSERT INTO TaiKhoan(HoTen,Email,SoDienThoai,MatKhau,VaiTro,TrangThai)
                    OUTPUT INSERTED.Id VALUES(@HoTen,@Email,'','GOOGLE',N'Customer',N'HoatDong')", conn);
                ins.Parameters.AddWithValue("@HoTen", hoTen);
                ins.Parameters.AddWithValue("@Email", email);
                int newId = Convert.ToInt32(ins.ExecuteScalar());
                return Ok(new { message = "Đăng nhập Google thành công!", user = new { id = newId, hoTen, email, soDienThoai = "", vaiTro = "Customer", trangThai = "HoatDong" } });
            }
            catch (Exception ex) { return Unauthorized(new { message = "Token không hợp lệ!", error = ex.Message }); }
        }
    }

    public class DangKyDto { public string HoTen { get; set; } = ""; public string Email { get; set; } = ""; public string? SoDienThoai { get; set; } public string MatKhau { get; set; } = ""; }
    public class DangNhapDto { public string Email { get; set; } = ""; public string MatKhau { get; set; } = ""; }
    public class GoogleDto { public string IdToken { get; set; } = ""; }
    public class TaoTaiKhoanDto { public string HoTen { get; set; } = ""; public string Email { get; set; } = ""; public string? SoDienThoai { get; set; } public string? MatKhau { get; set; } public string VaiTro { get; set; } = "Customer"; }
    public class CapNhatTaiKhoanDto { public string HoTen { get; set; } = ""; public string? SoDienThoai { get; set; } public string VaiTro { get; set; } = "Customer"; }
    public class DoiTrangThaiTkDto { public string TrangThai { get; set; } = "HoatDong"; }
    public class ThongTinCaNhanDto { public string HoTen { get; set; } = ""; public string? SoDienThoai { get; set; } }
}
