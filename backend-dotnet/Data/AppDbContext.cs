using Microsoft.EntityFrameworkCore;
using RestaurantApi.Models;

namespace RestaurantApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<BanAn> BanAns { get; set; }
        public DbSet<MonAn> MonAns { get; set; }
        public DbSet<DonDatBan> DonDatBans { get; set; }
        public DbSet<ChiTietDatMon> ChiTietDatMons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaiKhoan>().ToTable("TaiKhoan");
            modelBuilder.Entity<BanAn>().ToTable("BanAn");
            modelBuilder.Entity<MonAn>().ToTable("MonAn");
            modelBuilder.Entity<DonDatBan>().ToTable("DonDatBan");
            modelBuilder.Entity<ChiTietDatMon>().ToTable("ChiTietDatMon");

            modelBuilder.Entity<BanAn>().Property(b => b.TienCoc).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<MonAn>().Property(m => m.Gia).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<DonDatBan>().Property(d => d.TienCoc).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ChiTietDatMon>().Property(c => c.DonGia).HasColumnType("decimal(18,2)");
        }
    }
}
