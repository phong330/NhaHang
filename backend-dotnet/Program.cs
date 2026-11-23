using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("NhaHangDb")
    ));
builder.Services.AddCors(opt =>
    opt.AddPolicy("ChoPhepAngular", p =>
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors("ChoPhepAngular");

app.MapGet("/", () => Results.Json(new {
    thongBao = "Backend Nhà Hàng Phương Nam API đang hoạt động bình thường!",
    trangThai = "Online",
    cong = 5000,
    thoiGian = DateTime.Now
}));

app.MapControllers();
app.Run("http://localhost:5000");
