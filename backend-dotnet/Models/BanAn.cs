namespace RestaurantApi.Models
{
    // =============================================
    // MODEL: BanAn - Bàn ăn trong nhà hàng
    // =============================================
    public class BanAn
    {
        public int Id { get; set; }

        // Tên bàn hiển thị: "Bàn 01", "VIP 1", "Sân vườn 2"
        public string TenBan { get; set; } = "";

        // Loai: "Thuong" | "VIP" | "SanVuon" | "NgoaiTroi"
        public string Loai { get; set; } = "Thuong";

        // Số ghế tối đa: 2, 4, 6, 8, 10
        public int SucChua { get; set; } = 4;

        // TrangThai: "Trong" | "DaDat" | "DangPhucVu" | "BaoDuong"
        public string TrangThai { get; set; } = "Trong";

        // Mô tả thêm về bàn
        public string MoTa { get; set; } = "";

        // Ảnh bàn ăn (URL)
        public string Hinh { get; set; } = "";

        // Tiền cọc giữ bàn (VND)
        public decimal TienCoc { get; set; } = 100000;
    }
}
