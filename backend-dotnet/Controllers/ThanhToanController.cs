using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using RestaurantApi.Data;

namespace RestaurantApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThanhToanController : ControllerBase
    {
        private readonly IConfiguration _cfg;
        private readonly AppDbContext _db;
        public ThanhToanController(IConfiguration cfg, AppDbContext db) { _cfg = cfg; _db = db; }

        // POST /api/ThanhToan/tao-thanh-toan-vnpay
        [HttpPost("tao-thanh-toan-vnpay")]
        public IActionResult TaoVnPay([FromBody] VnPayDto dto)
        {
            string vnpUrl = _cfg["VnPay:BaseUrl"] ?? "";
            string tmnCode = _cfg["VnPay:TmnCode"] ?? "";
            string hashSecret = _cfg["VnPay:HashSecret"] ?? "";
            string returnUrl = _cfg["VnPay:ReturnUrl"] ?? "";
            string createDate = DateTime.Now.ToString("yyyyMMddHHmmss");
            long amount = dto.SoTien * 100;

            var p = new SortedList<string, string>
            {
                {"vnp_Version","2.1.0"}, {"vnp_Command","pay"}, {"vnp_TmnCode",tmnCode},
                {"vnp_Amount",amount.ToString()}, {"vnp_CreateDate",createDate},
                {"vnp_CurrCode","VND"}, {"vnp_IpAddr",LayIp()}, {"vnp_Locale","vn"},
                {"vnp_OrderInfo",$"Dat coc dat ban {dto.MaDatBan}"},
                {"vnp_OrderType","other"}, {"vnp_ReturnUrl",returnUrl}, {"vnp_TxnRef",dto.MaDatBan}
            };

            string qs = XayQueryString(p);
            string hash = HmacSha512(hashSecret, qs);
            return Ok(new { paymentUrl = vnpUrl + "?" + qs + "&vnp_SecureHash=" + hash });
        }

        // GET /api/ThanhToan/vnpay-return
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn()
        {
            var q = Request.Query;
            string hashSecret = _cfg["VnPay:HashSecret"] ?? "";
            string vnpHash = q["vnp_SecureHash"].ToString();

            var p = new SortedList<string, string>();
            foreach (var item in q)
                if (!string.IsNullOrEmpty(item.Value) && item.Key.StartsWith("vnp_") && item.Key != "vnp_SecureHash" && item.Key != "vnp_SecureHashType")
                    p.Add(item.Key, item.Value.ToString());

            string maDatBan = q["vnp_TxnRef"].ToString();
            string responseCode = q["vnp_ResponseCode"].ToString();

            if (!HmacSha512(hashSecret, XayQueryString(p)).Equals(vnpHash, StringComparison.OrdinalIgnoreCase))
                return Redirect($"http://localhost:4200/thanh-toan-ket-qua?maDatBan={maDatBan}&trangThai=fail&maLoi=sai-chu-ky");

            if (responseCode == "00")
            {
                // Cập nhật trạng thái thanh toán trong DB
                var don = await _db.DonDatBans.FirstOrDefaultAsync(d => d.MaDatBan == maDatBan);
                if (don != null)
                {
                    don.TrangThaiCoc = "DaThanhToan";
                    don.TrangThai = "DaXacNhan";
                    await _db.SaveChangesAsync();
                }
                return Redirect($"http://localhost:4200/thanh-toan-ket-qua?maDatBan={maDatBan}&trangThai=success");
            }

            return Redirect($"http://localhost:4200/thanh-toan-ket-qua?maDatBan={maDatBan}&trangThai=fail&maLoi={responseCode}");
        }

        // POST /api/ThanhToan/tao-ma-qr
        [HttpPost("tao-ma-qr")]
        public IActionResult TaoMaQR([FromBody] QRDto dto)
        {
            string soTK = "0123456789";
            string nganHang = "MB";
            string chuTK = "NHA HANG PHUONG NAM";
            string noiDung = $"Dat coc {dto.MaDatBan}";
            string qrUrl = $"https://img.vietqr.io/image/{nganHang}-{soTK}-compact2.png?amount={dto.SoTien}&addInfo={Uri.EscapeDataString(noiDung)}";
            return Ok(new { soTaiKhoan = soTK, nganHang = "MB Bank", chuTaiKhoan = chuTK, soTien = dto.SoTien, noiDung, qrUrl });
        }

        private string XayQueryString(SortedList<string, string> data)
        {
            var sb = new StringBuilder();
            foreach (var item in data)
            {
                if (sb.Length > 0) sb.Append("&");
                sb.Append(WebUtility.UrlEncode(item.Key)).Append("=").Append(WebUtility.UrlEncode(item.Value));
            }
            return sb.ToString();
        }

        private string HmacSha512(string key, string data)
        {
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
            return BitConverter.ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(data))).Replace("-", "").ToLower();
        }

        private string LayIp()
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            return ip == "::1" ? "127.0.0.1" : ip;
        }
    }

    public class VnPayDto { public string MaDatBan { get; set; } = ""; public long SoTien { get; set; } }
    public class QRDto { public string MaDatBan { get; set; } = ""; public long SoTien { get; set; } }
}
