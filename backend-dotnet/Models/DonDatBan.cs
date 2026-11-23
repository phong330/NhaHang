namespace RestaurantApi.Models
{
    // =============================================
    // MODEL: DonDatBan - Phiếu đặt bàn
    // =============================================
    public class DonDatBan
    {
        public int Id { get; set; }

        // Mã phiếu đặt bàn: "DB20261021123456"
        public string MaDatBan { get; set; } = "";

        public int TaiKhoanId { get; set; }

        public int BanAnId { get; set; }

        // Ngày đặt bàn (ngày khách tạo phiếu)
        public DateTime NgayDat { get; set; } = DateTime.Now;

        // Ngày/giờ khách đến ăn
        public DateTime NgayDen { get; set; }

        // Số lượng người
        public int SoNguoi { get; set; } = 1;

        // Ghi chú thêm của khách
        public string GhiChu { get; set; } = "";

        // TrangThai: "ChoDuyet" | "DaXacNhan" | "DangAn" | "HoanThanh" | "DaHuy"
        public string TrangThai { get; set; } = "ChoDuyet";

        // Tiền cọc đã thu
        public decimal TienCoc { get; set; } = 0;

        // TrangThaiCoc: "ChuaThanhToan" | "DaThanhToan"
        public string TrangThaiCoc { get; set; } = "ChuaThanhToan";
    }
}
