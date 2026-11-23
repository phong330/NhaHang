using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.Models;
using RestaurantApi.Services;

namespace RestaurantApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonAnController : ControllerBase
    {
        private readonly AppDbContext _db;
        public MonAnController(AppDbContext db) { _db = db; }

        // GET /api/MonAn?danhMuc=KhaiVi
        [HttpGet]
        public async Task<IActionResult> LayTatCa([FromQuery] string? danhMuc)
        {
            var q = _db.MonAns.AsQueryable();
            if (!string.IsNullOrEmpty(danhMuc) && danhMuc != "TatCa")
                q = q.Where(m => m.DanhMuc == danhMuc);
            var ds = await q.OrderBy(m => m.DanhMuc).ThenBy(m => m.TenMon)
                .Select(m => new { m.Id, m.TenMon, m.DanhMuc, m.Gia, m.Hinh, m.MoTa, m.NoiBat, m.ConHang })
                .ToListAsync();
            return Ok(ds);
        }

        // GET /api/MonAn/noi-bat
        [HttpGet("noi-bat")]
        public async Task<IActionResult> LayNoiBat()
        {
            var ds = await _db.MonAns.Where(m => m.NoiBat && m.ConHang)
                .Select(m => new { m.Id, m.TenMon, m.DanhMuc, m.Gia, m.Hinh, m.MoTa })
                .ToListAsync();
            return Ok(ds);
        }

        // GET /api/MonAn/5
        [HttpGet("{id}")]
        public async Task<IActionResult> LayTheoId(int id)
        {
            var m = await _db.MonAns.FindAsync(id);
            if (m == null) return NotFound(new { thongBao = "Không tìm thấy món ăn!" });
            return Ok(m);
        }

        // POST /api/MonAn
        [HttpPost]
        public async Task<IActionResult> ThemMon([FromBody] MonAnDto dto)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { thongBao = "Chỉ Quản trị viên mới có quyền thêm món mới vào thực đơn!" });
            var mon = new MonAn { TenMon = dto.TenMon.Trim(), DanhMuc = dto.DanhMuc, Gia = dto.Gia, Hinh = dto.Hinh ?? "", MoTa = dto.MoTa ?? "", NoiBat = dto.NoiBat, ConHang = true };
            _db.MonAns.Add(mon);
            await _db.SaveChangesAsync();
            return Ok(new { thongBao = "Thêm món thành công!", id = mon.Id });
        }

        // PUT /api/MonAn/5
        [HttpPut("{id}")]
        public async Task<IActionResult> SuaMon(int id, [FromBody] MonAnDto dto)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { thongBao = "Chỉ Quản trị viên mới có quyền chỉnh sửa thực đơn!" });
            var mon = await _db.MonAns.FindAsync(id);
            if (mon == null) return NotFound(new { thongBao = "Không tìm thấy món!" });
            mon.TenMon = dto.TenMon.Trim(); mon.DanhMuc = dto.DanhMuc; mon.Gia = dto.Gia;
            mon.Hinh = dto.Hinh ?? ""; mon.MoTa = dto.MoTa ?? ""; mon.NoiBat = dto.NoiBat; mon.ConHang = dto.ConHang;
            await _db.SaveChangesAsync();
            return Ok(new { thongBao = "Cập nhật món thành công!" });
        }

        // DELETE /api/MonAn/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaMon(int id)
        {
            if (!AuthHelper.LaAdmin(Request))
                return StatusCode(403, new { thongBao = "Chỉ Quản trị viên mới có quyền xóa món khỏi thực đơn!" });
            var mon = await _db.MonAns.FindAsync(id);
            if (mon == null) return NotFound(new { thongBao = "Không tìm thấy món!" });
            _db.MonAns.Remove(mon);
            await _db.SaveChangesAsync();
            return Ok(new { thongBao = "Xóa món thành công!" });
        }
    }

    public class MonAnDto
    {
        public string TenMon { get; set; } = "";
        public string DanhMuc { get; set; } = "MonChinh";
        public decimal Gia { get; set; }
        public string? Hinh { get; set; }
        public string? MoTa { get; set; }
        public bool NoiBat { get; set; }
        public bool ConHang { get; set; } = true;
    }
}
