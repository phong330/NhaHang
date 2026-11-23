# Hệ Thống Quản Lý Và Đặt Bàn Nhà Hàng Trực Tuyến (Phương Nam Restaurant)

Hệ thống quản lý và đặt bàn nhà hàng trực tuyến hoàn chỉnh với Backend ASP.NET Core .NET 8 và Frontend Angular 21 Standalone Components.

---

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: ASP.NET Core Web API (.NET 8.0)
- **Database**: Microsoft SQL Server + Entity Framework Core 8 + Raw SQL (cho xác thực tài khoản)
- **Frontend**: Angular 21 (Standalone Components, Reactive Forms, Router Guards)
- **Styling**: Tailwind CSS + Custom CSS (Tông màu chủ đạo: Đỏ trầm `#8B0000` & Vàng Gold `#D4AF37`)
- **Thanh toán & Tích hợp**:
  - Chuyển khoản ngân hàng qua mã **VietQR**
  - Thanh toán trực tiếp tại quầy
  - Đăng nhập tài khoản nhanh bằng **Google OAuth**

---

## 📂 Cấu Trúc Dự Án

```
QuanLyNhaHang/
├── NhaHangDB.sql                 # Script khởi tạo CSDL và nạp dữ liệu mẫu
├── README.md                     # Hướng dẫn chạy hệ thống
├── backend-dotnet/               # Dự án ASP.NET Core Web API (.NET 8)
│   ├── Controllers/
│   │   ├── TaiKhoanController.cs    # Đăng nhập, đăng ký, Google OAuth
│   │   ├── BanAnController.cs       # Quản lý bàn, kiểm tra bàn trống theo giờ
│   │   ├── MonAnController.cs       # Quản lý thực đơn món ăn
│   │   ├── DonDatBanController.cs   # Tạo đơn đặt bàn, cập nhật trạng thái, thống kê
│   │   └── ThanhToanController.cs   # Xử lý thanh toán cọc, sinh mã QR VietQR
│   ├── Models/                      # TaiKhoan, BanAn, MonAn, DonDatBan, ChiTietDatMon
│   ├── Data/AppDbContext.cs         # EF Core DbContext
│   ├── Services/AuthHelper.cs       # Tiện ích xác thực & phân quyền
│   ├── appsettings.json             # Cấu hình chuỗi kết nối CSDL, Google OAuth
│   └── Program.cs                   # Cấu hình DI, CORS, Port 5000
│
└── frontend-angular/             # Dự án Angular 21 Standalone
    ├── src/
    │   ├── app/
    │   │   ├── components/          # thanh-dieu-huong, chan-trang
    │   │   ├── pages/
    │   │   │   ├── trangchu/            # Trang giới thiệu, món nổi bật, đặt bàn nhanh
    │   │   │   ├── thuc-don/            # Danh sách món theo phân loại
    │   │   │   ├── dat-ban/             # Quy trình đặt bàn 4 bước + thanh toán
    │   │   │   ├── lich-su-dat-ban/     # Xem lịch sử đơn, trạng thái, hủy đơn
    │   │   │   ├── dangnhap/            # Đăng nhập / Đăng ký / Google Sign-In
    │   │   │   ├── thanh-toan-ket-qua/  # Thông báo kết quả đặt cọc / thanh toán
    │   │   │   └── admin/               # Quản trị (Dashboard, Đặt bàn, Bàn, Món, User)
    │   │   ├── guards/                  # admin.guard.ts, dangnhap.guard.ts
    │   │   ├── models/                  # Interface TypeScript
    │   │   └── services/                # AuthService, BanService, MonAnService, DatBanService, ThanhToanService
    │   └── styles.css                   # Định kiểu giao diện toàn cục
    └── package.json
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi tạo Cơ sở dữ liệu SQL Server
1. Mở **SQL Server Management Studio (SSMS)**.
2. Mở file [NhaHangDB.sql](file:///D:/webCK/QuanLyNhaHang/NhaHangDB.sql).
3. Nhấn **Execute (F5)** để tạo CSDL `NhaHangDB` cùng 5 bảng và nạp đầy đủ dữ liệu mẫu (20 bàn ăn, 50 món ăn, 4 tài khoản mẫu).

### 2. Khởi chạy dự án

#### Cách 1: Khởi chạy 1 thao tác bằng VS Code (Khuyên dùng)
- Nhấn tổ hợp phím **`Ctrl + Shift + B`** trong VS Code: Hệ thống tự động khởi chạy đồng thời cả Backend (.NET 8) và Frontend (Angular) trên 2 terminal riêng biệt.

#### Cách 2: Khởi chạy thủ công qua Terminal
- **Backend (.NET 8)**:
  ```powershell
  cd D:\webCK\QuanLyNhaHang\backend-dotnet
  dotnet run
  ```
  *Backend API chạy tại: **`http://localhost:5000`***

- **Frontend (Angular)**:
  ```powershell
  cd D:\webCK\QuanLyNhaHang\frontend-angular
  npm start
  ```
  *Truy cập website tại: **`http://localhost:4200`***

---

## 👤 Tài Khoản Mẫu Trải Nghiệm

| Vai trò | Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản lý (Admin)** | `admin@nhahang.vn` | `123456` | Toàn quyền quản trị Dashboard, bàn ăn, thực đơn, duyệt đơn, xem tài khoản |
| **Nhân viên (Staff)** | `nhanvien@nhahang.vn` | `123456` | Xem sơ đồ bàn, đổi trạng thái bàn, duyệt đơn đặt bàn, phục vụ |
| **Khách hàng (Customer)** | `an@gmail.com` | `123456` | Đặt bàn trực tuyến 4 bước, chọn món trước, xem lịch sử đặt bàn |

*(Khách hàng cũng có thể tự tạo tài khoản mới ngay trên giao diện Đăng ký hoặc Đăng nhập bằng Google)*.
