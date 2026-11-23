using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.Models;
using RestaurantApi.Services;

namespace RestaurantApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonDatBanController : ControllerBase
    {
        private readonly AppDbContext _db;
        public DonDatBanController(AppDbContext db) { _db = db; }

        // GET /api/DonDatBan - Tất cả đơn (Staff/Admin)
        [HttpGet]
        public async Task<IActionResult> LayTatCa([FromQuery] string? ngay)
        {
            if (!AuthHelper.LaStaff(Request))
                return StatusCode(403, new { thongBao = "Chỉ Nhân viên và Quản trị viên mới có quyền xem tất cả đơn đặt bàn!" });

            var q = _db.DonDatBans.AsQueryable();
            if (!string.IsNullOrEmpty(ngay) && DateTime.TryParse(ngay, out var dt))
                q = q.Where(d => d.NgayDen.Date == dt.Date);

            var ds = await q.OrderByDescending(d => d.Id)
                .Join(_db.TaiKhoans, d => d.TaiKhoanId, tk => tk.Id,
                    (d, tk) => new { d, hoTenKhach = tk.HoTen, emailKhach = tk.Email, sdtKhach = tk.SoDienThoai })
                .Join(_db.BanAns, x => x.d.BanAnId, b => b.Id,
                    (x, b) => new {
                        x.d.Id, x.d.MaDatBan, x.hoTenKhach, x.emailKhach, x.sdtKhach,
                        tenBan = b.TenBan, loaiBan = b.Loai,
                        ngayDen = x.d.NgayDen.ToString("dd/MM/yyyy HH:mm"),
                        x.d.SoNguoi, x.d.GhiChu, x.d.TrangThai,
                        x.d.TienCoc, x.d.TrangThaiCoc,
                        ngayDat = x.d.NgayDat.ToString("dd/MM/yyyy HH:mm")
                    })
                .ToListAsync();
            return Ok(ds);
        }

        // GET /api/DonDatBan/tai-khoan/5
        [HttpGet("tai-khoan/{taiKhoanId}")]
        public async Task<IActionResult> LayTheoTaiKhoan(int taiKhoanId)
        {
            // Customer chỉ được xem đơn của chính mình; Staff/Admin được xem của bất kỳ khách nào
            if (!AuthHelper.LaStaff(Request))
            {
                var currentUserId = AuthHelper.LayUserId(Request);
                if (currentUserId == 0 || currentUserId != taiKhoanId)
                    return StatusCode(403, new { thongBao = "Bạn chỉ có thể xem lịch sử đặt bàn của chính mình!" });
            }

            var ds = await _db.DonDatBans
                .Where(d => d.TaiKhoanId == taiKhoanId)
                .OrderByDescending(d => d.Id)
                .Join(_db.BanAns, d => d.BanAnId, b => b.Id,
                    (d, b) => new {
                        d.Id, d.MaDatBan, tenBan = b.TenBan, loaiBan = b.Loai,
                        ngayDen = d.NgayDen.ToString("dd/MM/yyyy HH:mm"),
                        d.SoNguoi, d.GhiChu, d.TrangThai, d.TienCoc, d.TrangThaiCoc
                    })
                .ToListAsync();
            return Ok(ds);
        }

        // GET /api/DonDatBan/5/chi-tiet
        [HttpGet("{id}/chi-tiet")]
        public async Task<IActionResult> LayChiTiet(int id)
        {
            var don = await _db.DonDatBans.FindAsync(id);
            if (don == null) return NotFound(new { thongBao = "Không tìm thấy đơn!" });

            // Customer chỉ xem đơn của chính mình
            if (!AuthHelper.LaStaff(Request))
            {
                var currentUserId = AuthHelper.LayUserId(Request);
                if (currentUserId == 0 || currentUserId != don.TaiKhoanId)
                    return StatusCode(403, new { thongBao = "Bạn không có quyền xem chi tiết đơn đặt bàn của khách khác!" });
            }

            var ban = await _db.BanAns.FindAsync(don.BanAnId);
            var khach = await _db.TaiKhoans.FindAsync(don.TaiKhoanId);
            var monDat = await _db.ChiTietDatMons
                .Where(c => c.DonDatBanId == id)
                .Join(_db.MonAns, c => c.MonAnId, m => m.Id,
                    (c, m) => new { m.TenMon, m.DanhMuc, c.SoLuong, c.DonGia, thanhTien = c.SoLuong * c.DonGia })
                .ToListAsync();

            return Ok(new {
                don.Id, don.MaDatBan,
                hoTenKhach = khach?.HoTen, emailKhach = khach?.Email, sdtKhach = khach?.SoDienThoai,
                tenBan = ban?.TenBan, loaiBan = ban?.Loai, sucChua = ban?.SucChua,
                ngayDen = don.NgayDen.ToString("dd/MM/yyyy HH:mm"),
                don.SoNguoi, don.GhiChu, don.TrangThai, don.TienCoc, don.TrangThaiCoc,
                danhSachMon = monDat,
                tongTienMon = monDat.Sum(m => m.thanhTien)
            });
        }

        // POST /api/DonDatBan - Tạo đơn đặt bàn
        [HttpPost]
        public async Task<IActionResult> TaoDon([FromBody] TaoDonDto dto)
        {
            if (dto.TaiKhoanId <= 0) return BadRequest(new { thongBao = "Chưa đăng nhập!" });
            if (dto.BanAnId <= 0) return BadRequest(new { thongBao = "Chưa chọn bàn!" });

            if (dto.NgayDen.Date < DateTime.Today)
            {
                return BadRequest(new { thongBao = "Không được đặt bàn vào ngày trong quá khứ! Vui lòng chọn từ hôm nay trở đi." });
            }

            if (dto.NgayDen < DateTime.Now.AddMinutes(-5))
            {
                return BadRequest(new { thongBao = "Thời gian đến đã qua! Vui lòng chọn khung giờ khác từ thời điểm hiện tại trở đi." });
            }

            var khach = await _db.TaiKhoans.FindAsync(dto.TaiKhoanId);
            if (khach == null) return BadRequest(new { thongBao = "Không tìm thấy tài khoản!" });

            var ban = await _db.BanAns.FindAsync(dto.BanAnId);
            if (ban == null) return BadRequest(new { thongBao = "Không tìm thấy bàn!" });

            var don = new DonDatBan
            {
                MaDatBan = "DB" + DateTime.Now.ToString("yyyyMMddHHmmss"),
                TaiKhoanId = dto.TaiKhoanId,
                BanAnId = dto.BanAnId,
                NgayDat = DateTime.Now,
                NgayDen = dto.NgayDen,
                SoNguoi = dto.SoNguoi,
                GhiChu = dto.GhiChu ?? "",
                TrangThai = "ChoDuyet",
                TienCoc = dto.TienCoc,
                TrangThaiCoc = dto.TienCoc > 0 ? "ChuaThanhToan" : "KhongCanCoc"
            };

            // Cập nhật trạng thái bàn sang 'DaDat'
            ban.TrangThai = "DaDat";
            _db.DonDatBans.Add(don);
            await _db.SaveChangesAsync();

            // Thêm chi tiết món đặt trước (nếu có)
            if (dto.DanhSachMon != null && dto.DanhSachMon.Count > 0)
            {
                foreach (var m in dto.DanhSachMon)
                {
                    _db.ChiTietDatMons.Add(new ChiTietDatMon
                    {
                        DonDatBanId = don.Id, MonAnId = m.MonAnId,
                        SoLuong = m.SoLuong, DonGia = m.DonGia
                    });
                }
                await _db.SaveChangesAsync();
            }



            return Ok(new { thongBao = "Đặt bàn thành công!", donId = don.Id, maDatBan = don.MaDatBan });
        }

        // PUT /api/DonDatBan/5/trang-thai
        [HttpPut("{id}/trang-thai")]
        public async Task<IActionResult> CapNhatTrangThai(int id, [FromBody] DoiTrangThaiDonDto dto)
        {
            var don = await _db.DonDatBans.FindAsync(id);
            if (don == null) return NotFound(new { thongBao = "Không tìm thấy đơn!" });

            var userId = AuthHelper.LayUserId(Request);

            // Customer chỉ được hủy đơn của chính mình khi đơn còn ở trạng thái Chờ duyệt
            if (AuthHelper.LaCustomer(Request))
            {
                if (don.TaiKhoanId != userId)
                    return StatusCode(403, new { thongBao = "Bạn không có quyền thao tác trên đơn của khách hàng khác!" });
                if (dto.TrangThai != "DaHuy")
                    return StatusCode(403, new { thongBao = "Khách hàng chỉ có quyền hủy đơn đặt bàn!" });
                if (don.TrangThai != "ChoDuyet")
                    return BadRequest(new { thongBao = "Đơn đã được xác nhận hoặc đang phục vụ, không thể hủy!" });
            }
            // Staff và Admin có toàn quyền đổi trạng thái nghiệp vụ
            else if (!AuthHelper.LaStaff(Request))
            {
                return StatusCode(403, new { thongBao = "Bạn không có quyền cập nhật trạng thái đơn đặt bàn!" });
            }

            don.TrangThai = dto.TrangThai;
            if (dto.TrangThaiCoc != null) don.TrangThaiCoc = dto.TrangThaiCoc;

            // Cập nhật lại trạng thái bàn ăn khi thay đổi trạng thái đơn
            var ban = await _db.BanAns.FindAsync(don.BanAnId);
            if (ban != null)
            {
                if (dto.TrangThai == "DaHuy" || dto.TrangThai == "HoanThanh")
                {
                    // Nếu đơn bị hủy hoặc đã hoàn thành: kiểm tra xem bàn có đơn nào khác đang giữ không
                    bool conDonKhac = await _db.DonDatBans.AnyAsync(d =>
                        d.Id != don.Id &&
                        d.BanAnId == ban.Id &&
                        (d.TrangThai == "ChoDuyet" || d.TrangThai == "DaXacNhan" || d.TrangThai == "DangAn"));

                    if (!conDonKhac)
                    {
                        ban.TrangThai = "Trong"; // Trả lại bàn trống, số lượng bàn khả dụng tăng trở lại
                    }
                }
                else if (dto.TrangThai == "DangAn")
                {
                    ban.TrangThai = "DangPhucVu";
                }
                else if (dto.TrangThai == "DaXacNhan" || dto.TrangThai == "ChoDuyet")
                {
                    ban.TrangThai = "DaDat";
                }
            }

            await _db.SaveChangesAsync();
            return Ok(new { thongBao = "Cập nhật thành công!", trangThai = don.TrangThai });
        }

        // GET /api/DonDatBan/thong-ke
        [HttpGet("thong-ke")]
        public async Task<IActionResult> ThongKe()
        {
            if (!AuthHelper.LaStaff(Request))
                return StatusCode(403, new { thongBao = "Chỉ Nhân viên và Quản trị viên mới được xem thống kê!" });

            var homNay = DateTime.Today;
            return Ok(new {
                tongDatBan = await _db.DonDatBans.CountAsync(),
                datBanHomNay = await _db.DonDatBans.CountAsync(d => d.NgayDen.Date == homNay && d.TrangThai != "DaHuy"),
                choDuyet = await _db.DonDatBans.CountAsync(d => d.TrangThai == "ChoDuyet"),
                daXacNhan = await _db.DonDatBans.CountAsync(d => d.TrangThai == "DaXacNhan"),
                daHuy = await _db.DonDatBans.CountAsync(d => d.TrangThai == "DaHuy"),
                banTrong = await _db.BanAns.CountAsync(b => b.TrangThai == "Trong"),
                tongDoanhThuCoc = await _db.DonDatBans
                    .Where(d => d.TrangThaiCoc == "DaThanhToan" && d.TrangThai != "DaHuy")
                    .SumAsync(d => d.TienCoc)
            });
        }

        // GET /api/DonDatBan/doanh-thu-thang
        [HttpGet("doanh-thu-thang")]
        public async Task<IActionResult> DoanhThuThang()
        {
            if (!AuthHelper.LaStaff(Request))
                return StatusCode(403, new { thongBao = "Chỉ Nhân viên và Quản trị viên mới được xem doanh thu!" });

            int nam = DateTime.Now.Year;
            var data = await _db.DonDatBans
                .Where(d => d.NgayDat.Year == nam && d.TrangThaiCoc == "DaThanhToan" && d.TrangThai != "DaHuy")
                .GroupBy(d => d.NgayDat.Month)
                .Select(g => new { thangSo = g.Key, doanhThu = g.Sum(x => x.TienCoc) })
                .OrderBy(x => x.thangSo)
                .ToListAsync();

            decimal max = data.Count > 0 ? data.Max(x => x.doanhThu) : 1;
            return Ok(data.Select(x => new {
                nam = nam,
                thangSo = x.thangSo,
                thang = x.thangSo.ToString(),
                doanhThu = x.doanhThu,
                phanTram = Math.Round((x.doanhThu / max) * 100, 0)
            }));
        }
    }

    public class TaoDonDto
    {
        public int TaiKhoanId { get; set; }
        public int BanAnId { get; set; }
        public DateTime NgayDen { get; set; }
        public int SoNguoi { get; set; } = 1;
        public string? GhiChu { get; set; }
        public decimal TienCoc { get; set; } = 0;
        public List<MonDatDto>? DanhSachMon { get; set; }
    }

    public class MonDatDto
    {
        public int MonAnId { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    public class DoiTrangThaiDonDto
    {
        public string TrangThai { get; set; } = "";
        public string? TrangThaiCoc { get; set; }
    }
}
