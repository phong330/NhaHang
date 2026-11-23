namespace RestaurantApi.Models
{
    // =============================================
    // MODEL: ChiTietDatMon - Món ăn đặt trước
    // =============================================
    public class ChiTietDatMon
    {
        public int Id { get; set; }

        public int DonDatBanId { get; set; }

        public int MonAnId { get; set; }

        public int SoLuong { get; set; } = 1;

        public decimal DonGia { get; set; }
    }
}
