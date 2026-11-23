using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.Models;
using RestaurantApi.Services;

namespace RestaurantApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BanAnController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BanAnController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/BanAn - Lấy tất cả bàn ăn
        [HttpGet]
        public async Task<IActionResult> LayTatCaBan()
        {
            var danhSach = await _context.BanAns
                .OrderBy(b => b.Id)
                .Select(b => new
                {
                    id = b.Id,
                    tenBan = b.TenBan,
                    loai = b.Loai,
                    sucChua = b.SucChua,
                    trangThai = b.TrangThai,
                    moTa = b.MoTa,
                    hinh = b.Hinh,
                    tienCoc = b.TienCoc
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        // GET /api/BanAn/trong?ngayDen=2026-12-25T19:00&soNguoi=4
        // Lấy danh sách bàn còn trống theo ngày giờ và số người
        [HttpGet("trong")]
        public async Task<IActionResult> LayBanConTrong(
            [FromQuery] DateTime ngayDen,
            [FromQuery] int soNguoi = 1)
        {
            if (ngayDen.Date < DateTime.Today)
            {
                return BadRequest(new { thongBao = "Không thể tìm bàn trống cho ngày trong quá khứ! Vui lòng chọn từ hôm nay trở đi." });
            }

            // Khung giờ block: 2 tiếng mỗi lượt
            var gioKetThuc = ngayDen.AddHours(2);

            // Lấy các bàn đã có đặt chỗ trong khung giờ đó (không tính đơn đã hủy hoặc đã hoàn thành)
            var banDaDatIds = await _context.DonDatBans
                .Where(d =>
                    d.TrangThai != "DaHuy" &&
                    d.TrangThai != "HoanThanh" &&
                    d.NgayDen < gioKetThuc &&
                    d.NgayDen.AddHours(2) > ngayDen)
                .Select(d => d.BanAnId)
                .Distinct()
                .ToListAsync();

            // Lấy các bàn còn trống và đủ sức chứa (không bị trùng lịch và không bảo dưỡng)
            var banTrong = await _context.BanAns
                .Where(b =>
                    !banDaDatIds.Contains(b.Id) &&
                    b.TrangThai != "BaoDuong" &&
                    b.SucChua >= soNguoi)
                .OrderBy(b => b.SucChua)
                .Select(b => new
                {
                    id = b.Id,
                    tenBan = b.TenBan,
                    loai = b.Loai,
                    sucChua = b.SucChua,
                    moTa = b.MoTa,
                    hinh = b.Hinh,
                    tienCoc = b.TienCoc
                })
                .ToListAsync();

            return Ok(banTrong);
        }

        // GET /api/BanAn/5 - Chi tiết bàn
        [HttpGet("{id}")]
        public async Task<IActionResult> LayBanTheoId(int id)
        {
            var ban = await _context.BanAns.FindAsync(id);
            if (ban == null)
                return NotFound(new { thongBao = "Không tìm thấy bàn!" });

            return Ok(ban);
        }

        // POST /api/BanAn - Thêm bàn mới (Admin)
        [HttpPost]
        public async Task<IActionResult> ThemBan([FromBody] BanAnDto dto)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { thongBao = "Chỉ Quản trị viên mới có quyền thêm bàn mới!" });
            var ban = new BanAn
            {
                TenBan = dto.TenBan.Trim(),
                Loai = dto.Loai,
                SucChua = dto.SucChua,
                TrangThai = "Trong",
                MoTa = dto.MoTa ?? "",
                Hinh = dto.Hinh ?? "",
                TienCoc = dto.TienCoc
            };

            _context.BanAns.Add(ban);
            await _context.SaveChangesAsync();

            return Ok(new { thongBao = "Thêm bàn thành công!", id = ban.Id });
        }

        // PUT /api/BanAn/5 - Sửa thông tin bàn (Admin)
        [HttpPut("{id}")]
        public async Task<IActionResult> SuaBan(int id, [FromBody] BanAnDto dto)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { thongBao = "Chỉ Quản trị viên mới có quyền sửa thông tin bàn!" });
            var ban = await _context.BanAns.FindAsync(id);
            if (ban == null)
                return NotFound(new { thongBao = "Không tìm thấy bàn!" });

            ban.TenBan = dto.TenBan.Trim();
            ban.Loai = dto.Loai;
            ban.SucChua = dto.SucChua;
            ban.MoTa = dto.MoTa ?? "";
            ban.Hinh = dto.Hinh ?? "";
            ban.TienCoc = dto.TienCoc;

            await _context.SaveChangesAsync();
            return Ok(new { thongBao = "Cập nhật bàn thành công!" });
        }

        // PATCH /api/BanAn/5/trang-thai - Đổi trạng thái bàn (Staff/Admin)
        [HttpPatch("{id}/trang-thai")]
        public async Task<IActionResult> DoiTrangThai(int id, [FromBody] DoiTrangThaiDto dto)
        {
            if (!AuthHelper.LaStaff(Request))
                return StatusCode(403, new { thongBao = "Không có quyền đổi trạng thái bàn!" });
            var ban = await _context.BanAns.FindAsync(id);
            if (ban == null)
                return NotFound(new { thongBao = "Không tìm thấy bàn!" });

            ban.TrangThai = dto.TrangThai;
            await _context.SaveChangesAsync();

            return Ok(new { thongBao = "Cập nhật trạng thái thành công!", trangThai = ban.TrangThai });
        }

        // DELETE /api/BanAn/5 - Xoá bàn (Admin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaBan(int id)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { thongBao = "Chỉ Quản trị viên mới có quyền xóa bàn!" });
            var ban = await _context.BanAns.FindAsync(id);
            if (ban == null)
                return NotFound(new { thongBao = "Không tìm thấy bàn!" });

            _context.BanAns.Remove(ban);
            await _context.SaveChangesAsync();

            return Ok(new { thongBao = "Xoá bàn thành công!" });
        }
    }

    public class BanAnDto
    {
        public string TenBan { get; set; } = "";
        public string Loai { get; set; } = "Thuong";
        public int SucChua { get; set; } = 4;
        public string? MoTa { get; set; }
        public string? Hinh { get; set; }
        public decimal TienCoc { get; set; } = 100000;
    }

    public class DoiTrangThaiDto
    {
        public string TrangThai { get; set; } = "";
    }
}
