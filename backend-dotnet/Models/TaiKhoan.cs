namespace RestaurantApi.Models
{
    // =============================================
    // MODEL: TaiKhoan - Tài khoản người dùng
    // =============================================
    public class TaiKhoan
    {
        public int Id { get; set; }

        public string HoTen { get; set; } = "";

        public string Email { get; set; } = "";

        public string SoDienThoai { get; set; } = "";

        public string MatKhau { get; set; } = "";

        // VaiTro: "Customer" | "Staff" | "Admin" (hoặc "KhachHang" | "NhanVien" | "QuanLy")
        public string VaiTro { get; set; } = "Customer";

        // TrangThai: "HoatDong" | "BiKhoa"
        public string TrangThai { get; set; } = "HoatDong";
    }
}
