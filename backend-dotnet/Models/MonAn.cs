namespace RestaurantApi.Models
{
    // =============================================
    // MODEL: MonAn - Món ăn trong thực đơn
    // =============================================
    public class MonAn
    {
        public int Id { get; set; }

        public string TenMon { get; set; } = "";

        // DanhMuc: "KhaiVi" | "MonChinh" | "TrangMieng" | "DoUong"
        public string DanhMuc { get; set; } = "MonChinh";

        public decimal Gia { get; set; }

        public string Hinh { get; set; } = "";

        public string MoTa { get; set; } = "";

        public bool NoiBat { get; set; } = false;

        public bool ConHang { get; set; } = true;
    }
}
