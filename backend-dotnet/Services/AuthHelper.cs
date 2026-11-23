using Microsoft.AspNetCore.Mvc;

namespace RestaurantApi.Services
{
    public static class AuthHelper
    {
        public static string LayVaiTro(HttpRequest request)
        {
            return request.Headers.TryGetValue("X-User-Role", out var role) ? role.ToString() : "";
        }

        public static int LayUserId(HttpRequest request)
        {
            return request.Headers.TryGetValue("X-User-Id", out var id) && int.TryParse(id, out var userId) ? userId : 0;
        }

        public static bool LaAdmin(HttpRequest request)
        {
            var r = LayVaiTro(request);
            return r is "Admin" or "QuanLy";
        }

        public static bool LaStaff(HttpRequest request)
        {
            var r = LayVaiTro(request);
            return r is "Admin" or "QuanLy" or "Staff" or "NhanVien";
        }

        public static bool LaCustomer(HttpRequest request)
        {
            var r = LayVaiTro(request);
            return r is "Customer" or "KhachHang";
        }

        public static bool LaQuanLy(HttpRequest request) => LaAdmin(request);
        public static bool LaNhanVien(HttpRequest request) => LaStaff(request);
        public static bool DaDangNhap(HttpRequest request) => LayUserId(request) > 0;
    }
}
