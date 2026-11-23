-- ====================================================================
-- HỆ THỐNG QUẢN LÝ VÀ ĐẶT BÀN NHÀ HÀNG TRỰC TUYẾN - NHÀ HÀNG PHƯƠNG NAM
-- CƠ SỞ DỮ LIỆU: NhaHangDB
-- Chuẩn hóa: 20 BÀN ĂN (B01-B20) & 50 MÓN ĂN (6 DANH MỤC)
-- ====================================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NhaHangDB')
    CREATE DATABASE NhaHangDB;
GO

USE NhaHangDB;
GO

-- Xóa bảng cũ nếu tồn tại
IF OBJECT_ID('ChiTietDatMon','U') IS NOT NULL DROP TABLE ChiTietDatMon;
IF OBJECT_ID('DonDatBan','U')    IS NOT NULL DROP TABLE DonDatBan;
IF OBJECT_ID('MonAn','U')        IS NOT NULL DROP TABLE MonAn;
IF OBJECT_ID('BanAn','U')        IS NOT NULL DROP TABLE BanAn;
IF OBJECT_ID('TaiKhoan','U')     IS NOT NULL DROP TABLE TaiKhoan;
GO

-- =============================================
-- 1. BẢNG TÀI KHOẢN (TaiKhoan)
-- =============================================
CREATE TABLE TaiKhoan (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    HoTen       NVARCHAR(100)  NOT NULL,
    Email       NVARCHAR(100)  NOT NULL UNIQUE,
    SoDienThoai NVARCHAR(20)   NOT NULL DEFAULT '',
    MatKhau     NVARCHAR(255)  NOT NULL,
    VaiTro      NVARCHAR(50)   NOT NULL DEFAULT N'Customer',
    -- VaiTro: Customer | Staff | Admin
    TrangThai   NVARCHAR(50)   NOT NULL DEFAULT N'HoatDong'
    -- TrangThai: HoatDong | BiKhoa
);
GO

-- =============================================
-- 2. BẢNG BÀN ĂN (BanAn)
-- =============================================
CREATE TABLE BanAn (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    TenBan      NVARCHAR(100)  NOT NULL,
    Loai        NVARCHAR(50)   NOT NULL DEFAULT N'KhuA',
    -- Loai / KhuVuc: KhuA | KhuB | VIP
    SucChua     INT            NOT NULL DEFAULT 4,
    -- SucChua: 2 đến 8 khách
    TrangThai   NVARCHAR(50)   NOT NULL DEFAULT N'Trong',
    -- TrangThai: Trong | DaDat | DangPhucVu | BaoDuong
    MoTa        NVARCHAR(500)  NOT NULL DEFAULT '',
    Hinh        NVARCHAR(MAX)  NOT NULL DEFAULT '',
    TienCoc     DECIMAL(18,2)  NOT NULL DEFAULT 100000
);
GO

-- =============================================
-- 3. BẢNG MÓN ĂN (MonAn)
-- =============================================
CREATE TABLE MonAn (
    Id      INT IDENTITY(1,1) PRIMARY KEY,
    TenMon  NVARCHAR(200)  NOT NULL,
    DanhMuc NVARCHAR(50)   NOT NULL DEFAULT N'MonChinh',
    -- DanhMuc: KhaiVi | MonChinh | HaiSan | MonChay | DoUong | TrangMieng
    Gia     DECIMAL(18,2)  NOT NULL,
    Hinh    NVARCHAR(MAX)  NOT NULL DEFAULT '',
    MoTa    NVARCHAR(500)  NOT NULL DEFAULT '',
    NoiBat  BIT            NOT NULL DEFAULT 0,
    ConHang BIT            NOT NULL DEFAULT 1
);
GO

-- =============================================
-- 4. BẢNG ĐƠN ĐẶT BÀN (DonDatBan)
-- =============================================
CREATE TABLE DonDatBan (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    MaDatBan    NVARCHAR(30)   NOT NULL UNIQUE,
    TaiKhoanId  INT            NOT NULL FOREIGN KEY REFERENCES TaiKhoan(Id),
    BanAnId     INT            NOT NULL FOREIGN KEY REFERENCES BanAn(Id),
    NgayDat     DATETIME       NOT NULL DEFAULT GETDATE(),
    NgayDen     DATETIME       NOT NULL,
    SoNguoi     INT            NOT NULL DEFAULT 1,
    GhiChu      NVARCHAR(500)  NOT NULL DEFAULT '',
    TrangThai   NVARCHAR(50)   NOT NULL DEFAULT N'ChoDuyet',
    -- TrangThai: ChoDuyet | DaXacNhan | DangAn | HoanThanh | DaHuy
    TienCoc     DECIMAL(18,2)  NOT NULL DEFAULT 0,
    TrangThaiCoc NVARCHAR(50)  NOT NULL DEFAULT N'ChuaThanhToan'
    -- TrangThaiCoc: ChuaThanhToan | DaThanhToan | KhongCanCoc
);
GO

-- =============================================
-- 5. BẢNG CHI TIẾT ĐẶT MÓN (ChiTietDatMon)
-- =============================================
CREATE TABLE ChiTietDatMon (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    DonDatBanId INT            NOT NULL FOREIGN KEY REFERENCES DonDatBan(Id) ON DELETE CASCADE,
    MonAnId     INT            NOT NULL FOREIGN KEY REFERENCES MonAn(Id),
    SoLuong     INT            NOT NULL DEFAULT 1,
    DonGia      DECIMAL(18,2)  NOT NULL
);
GO

-- =============================================
-- NẠP DỮ LIỆU MẪU: TÀI KHOẢN (3 Tài Khoản)
-- =============================================
INSERT INTO TaiKhoan (HoTen, Email, SoDienThoai, MatKhau, VaiTro, TrangThai) VALUES
(N'Quản Lý Nhà Hàng', 'admin@nhahang.vn',    '0901234567', '123456', N'Admin',    N'HoatDong'),
(N'Nhân Viên Phục Vụ','nhanvien@nhahang.vn', '0912345678', '123456', N'Staff',    N'HoatDong'),
(N'Nguyễn Văn An',    'an@gmail.com',         '0923456789', '123456', N'Customer', N'HoatDong');
GO

-- =============================================
-- NẠP DỮ LIỆU MẪU: 20 BÀN ĂN (B01 - B20)
-- Phân chia: KhuA (7 bàn), KhuB (7 bàn), VIP (6 bàn)
-- Sức chứa: 2 - 8 người
-- Trạng thái: Trong (14), DaDat (2), DangPhucVu (3), BaoDuong (1)
-- =============================================
INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
-- Khu vực A (B01 - B07)
(N'B01 - Bàn 2 khách Khu A', N'KhuA', 2, N'Trong', N'Bàn đôi riêng tư cạnh cửa sổ thoáng mát, Khu vực A', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80', 50000),
(N'B02 - Bàn 2 khách Khu A', N'KhuA', 2, N'Trong', N'Bàn 2 người lãng mạn ánh sáng nhẹ nhàng, Khu vực A', 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80', 50000),
(N'B03 - Bàn 4 khách Khu A', N'KhuA', 4, N'Trong', N'Bàn 4 người ghế bọc da êm ái, trung tâm Khu vực A', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', 100000),
(N'B04 - Bàn 4 khách Khu A', N'KhuA', 4, N'DaDat', N'Bàn 4 người gia đình ấm cúng, Khu vực A', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80', 100000),
(N'B05 - Bàn 6 khách Khu A', N'KhuA', 6, N'Trong', N'Bàn tròn 6 khách phù hợp tụ họp bạn bè, Khu vực A', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', 150000),
(N'B06 - Bàn 6 khách Khu A', N'KhuA', 6, N'DangPhucVu', N'Bàn dài 6 khách không gian sảnh chính, Khu vực A', 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80', 150000),
(N'B07 - Bàn 8 khách Khu A', N'KhuA', 8, N'Trong', N'Bàn tiệc lớn 8 khách rộng rãi sảnh tiệc, Khu vực A', 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80', 200000),

-- Khu vực B (B08 - B14)
(N'B08 - Bàn 2 khách Khu B', N'KhuB', 2, N'Trong', N'Bàn đôi ngắm cảnh sân vườn xanh mát, Khu vực B', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', 60000),
(N'B09 - Bàn 4 khách Khu B', N'KhuB', 4, N'Trong', N'Bàn 4 khách cạnh tiểu cảnh nước và hoa, Khu vực B', 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80', 100000),
(N'B10 - Bàn 4 khách Khu B', N'KhuB', 4, N'Trong', N'Bàn 4 khách không gian mở ngoài trời mát mẻ, Khu vực B', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', 100000),
(N'B11 - Bàn 6 khách Khu B', N'KhuB', 6, N'DangPhucVu', N'Bàn 6 người sân vườn có đèn trang trí lung linh buổi tối, Khu vực B', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', 150000),
(N'B12 - Bàn 6 khách Khu B', N'KhuB', 6, N'Trong', N'Bàn 6 người ban công tầng lửng đón gió tự nhiên, Khu vực B', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', 150000),
(N'B13 - Bàn 8 khách Khu B', N'KhuB', 8, N'Trong', N'Bàn tiệc ngoài trời 8 khách view toàn cảnh lung linh, Khu vực B', 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=800&q=80', 200000),
(N'B14 - Bàn 8 khách Khu B', N'KhuB', 8, N'BaoDuong', N'Bàn 8 khách khu vực sân thượng (đang nâng cấp ánh sáng cảnh quan)', 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80', 200000),

-- Khu vực VIP (B15 - B20)
(N'B15 - Bàn VIP 2 khách Hoàng Gia', N'VIP', 2, N'Trong', N'Phòng VIP Hoàng Gia 2 khách, hoa tươi và nhạc acoustic theo yêu cầu', 'https://images.unsplash.com/photo-1677449243782-edbd92d8454f?auto=format&fit=crop&w=800&q=80', 150000),
(N'B16 - Bàn VIP 4 khách Kim Cương', N'VIP', 4, N'Trong', N'Phòng VIP Kim Cương 4 khách, cách âm tuyệt đối, nội thất hoàng gia cao cấp', 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=800&q=80', 250000),
(N'B17 - Bàn VIP 4 khách Ruby', N'VIP', 4, N'DaDat', N'Phòng VIP Ruby 4 khách phong cách tân cổ điển, có nhân viên phục vụ riêng', 'https://images.unsplash.com/photo-1786106155538-6c1b2e0a9f2b?auto=format&fit=crop&w=800&q=80', 250000),
(N'B18 - Bàn VIP 6 khách Sapphire', N'VIP', 6, N'Trong', N'Phòng VIP Sapphire 6 khách đón tiếp đối tác kinh doanh trang trọng', 'https://images.unsplash.com/photo-1776373932973-17943d9428d9?auto=format&fit=crop&w=800&q=80', 350000),
(N'B19 - Bàn VIP 8 khách Emerald', N'VIP', 8, N'DangPhucVu', N'Phòng VIP Emerald 8 khách có bàn xoay tiện nghi, hướng nhìn phố lung linh', 'https://images.unsplash.com/photo-1788029996854-ff63b9291f0b?auto=format&fit=crop&w=800&q=80', 500000),
(N'B20 - Bàn VIP 8 khách Thượng Đỉnh', N'VIP', 8, N'Trong', N'Đại sảnh VIP Thượng Đỉnh 8 khách, hệ thống karaoke cao cấp và ban công riêng', 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80', 500000);
GO

-- =============================================
-- NẠP DỮ LIỆU MẪU: 50 MÓN ĂN THỰC TẾ (6 DANH MỤC)
-- =============================================
INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
-- ===== 1. KHAI VỊ (7 món) =====
(N'Gỏi cuốn tôm thịt Nam Bộ', N'KhaiVi', 65000,
 'https://images.unsplash.com/photo-1761315414749-2f061917b997?auto=format&fit=crop&w=600&q=80',
 N'Gỏi cuốn bánh tráng dẻo, nhân tôm sú tươi, thịt ba chỉ luộc ăn kèm nước tương đậu phộng béo bùi.', 1, 1),

(N'Bánh mì bơ tỏi nướng phô mai', N'KhaiVi', 49000,
 'https://images.unsplash.com/photo-1556008531-57e6eefc7be4?auto=format&fit=crop&w=600&q=80',
 N'Bánh mì baguette nướng giòn tan ngập bơ tỏi thơm lừng và phô mai Mozzarella kéo sợi.', 0, 1),

(N'Soup bí đỏ kem tươi hạnh nhân', N'KhaiVi', 55000,
 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=600&q=80',
 N'Soup bí đỏ Nhật xay nhuyễn mịn màng, hòa quyện cùng kem tươi béo ngậy và hạnh nhân lát rang thơm.', 0, 1),

(N'Gỏi ngó sen tôm thịt chua ngọt', N'KhaiVi', 85000,
 'https://images.unsplash.com/photo-1684675124739-bef0072d108a?auto=format&fit=crop&w=600&q=80',
 N'Ngó sen tươi giòn sần sật bóp thấu cùng tôm sú luộc, thịt ba chỉ và nước mắm chua cay truyền thống.', 1, 1),

(N'Nem nướng Nha Trang cuốn bánh tráng', N'KhaiVi', 95000,
 'https://images.unsplash.com/photo-1695754151519-4f5f132a393d?auto=format&fit=crop&w=600&q=80',
 N'Nem nướng than hoa thơm lừng ăn kèm bánh tráng chiên giòn, dưa leo, xoài xanh và nước chấm gan nếp.', 1, 1),

(N'Khoai tây múi cau chiên bơ tỏi', N'KhaiVi', 45000,
 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
 N'Khoai tây nhập khẩu cắt múi cau chiên vàng ruộm, lắc bột phô mai hoặc bơ tỏi đậm đà.', 0, 1),

(N'Salad ức gà sốt mè rang Nhật Bản', N'KhaiVi', 69000,
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
 N'Rau xà lách thủy canh tươi mát, cà chua bi, trứng cút cùng ức gà nướng xé sợi sốt mè rang.', 0, 1),

-- ===== 2. MÓN CHÍNH (10 món) =====
(N'Bò nướng lá lốt mỡ chài', N'MonChinh', 185000,
 'https://images.unsplash.com/photo-1644288232801-2b40ff99d54f?auto=format&fit=crop&w=600&q=80',
 N'Thịt bò tươi ướp gia vị đậm đà cuộn trong lá lốt bánh tẻ nướng than hoa thơm nức mũi.', 1, 1),

(N'Bò bít tết sốt tiêu đen thượng hạng', N'MonChinh', 265000,
 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
 N'Thăn bò Úc mềm mọng nước áp chảo chín tới, rưới sốt tiêu đen Phú Quốc cay nồng thơm lừng.', 1, 1),

(N'Cá lóc đồng kho tộ Nam Bộ', N'MonChinh', 145000,
 'https://images.unsplash.com/photo-1773901344817-537194056c1a?auto=format&fit=crop&w=600&q=80',
 N'Cá lóc đồng tươi kho tộ đất nước hàng sánh đặc, vị mặn ngọt đậm đà, rắc tiêu ớt cay thơm.', 1, 1),

(N'Lẩu riêu cua đồng bắp bò sườn sụn', N'MonChinh', 345000,
 'https://images.unsplash.com/photo-1550388341-d3d5ac2a724e?auto=format&fit=crop&w=600&q=80',
 N'Gạch cua đồng béo ngậy nấu giấm bỗng chua dịu, ăn kèm bắp bò hoa giòn sần sật và sườn sụn non.', 1, 1),

(N'Cơm gà Hội An xé phay đặc sản', N'MonChinh', 95000,
 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
 N'Cơm nấu nước luộc gà vàng ươm dẻo thơm, thịt gà ta xé bóp gỏi hành tây rau răm đậm vị.', 0, 1),

(N'Heo quay da giòn bánh hỏi Nam Bộ', N'MonChinh', 220000,
 'https://images.unsplash.com/photo-1504649346668-2cc86afaa2e1?auto=format&fit=crop&w=600&q=80',
 N'Thịt ba chỉ heo quay lò than da nổ giòn tan rụm, thịt mềm ngọt ăn cùng bánh hỏi mỡ hành.', 0, 0), -- Tạm hết hàng

(N'Sườn cừu nướng thảo mộc đút lò', N'MonChinh', 295000,
 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
 N'Dẻ sườn cừu ướp lá hương thảo, tỏi và dầu ô liu nướng chín vừa thơm mềm không hề ngấy.', 0, 1),

(N'Gà đồi nướng mật ong rừng cơm lam', N'MonChinh', 210000,
 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80',
 N'Gà thả đồi ướp mật ong hoa rừng nướng than hoa vàng ruộm, thưởng thức cùng cơm lam dẻo thơm.', 1, 1),

(N'Bún bò Huế thượng hạng chả cua', N'MonChinh', 85000,
 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?auto=format&fit=crop&w=600&q=80',
 N'Nước dùng chuẩn vị cố đô thơm mùi sả ruốc, thịt nạm bò mềm, móng giò và chả cua thơm ngon.', 0, 1),

(N'Vịt quay da giòn thảo mộc Phương Nam', N'MonChinh', 320000,
 'https://images.unsplash.com/photo-1765441012353-10fb4701a276?auto=format&fit=crop&w=600&q=80',
 N'Vịt béo tẩm ướp thảo quả hồi quế quay chín vàng óng ánh, lớp da giòn rụm chấm nước sốt mận chua ngọt.', 0, 1),

-- ===== 3. HẢI SẢN (10 món) =====
(N'Chả giò hải sản giòn rụm', N'HaiSan', 79000,
 'https://images.unsplash.com/photo-1515022376298-7333f33e704b?auto=format&fit=crop&w=600&q=80',
 N'Vỏ chả giò rế chiên vàng ươm, nhân tôm, mực, củ năng giòn ngọt chấm sốt mayonnaise chua ngọt.', 0, 1),

(N'Mực khoanh chiên giòn sốt Tartar', N'HaiSan', 99000,
 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
 N'Mực ống tươi cắt khoanh tẩm bột xù chiên vàng, giòn bên ngoài mềm ngọt bên trong.', 0, 1),

(N'Cá hồi Nauy áp chảo sốt bơ chanh', N'HaiSan', 245000,
 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
 N'Phi lê cá hồi tươi Nauy áp chảo da giòn thịt mềm béo, ăn kèm măng tây và sốt bơ chanh thanh mát.', 1, 1),

(N'Tôm càng xanh rang muối tuyết', N'HaiSan', 250000,
 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
 N'Tôm càng xanh sông lớn rang lớp muối tuyết mỏng thơm cay, thịt tôm ngọt lịm chắc nịch.', 1, 1),

(N'Tôm hùm bỏ lò phô mai hảo hạng', N'HaiSan', 480000,
 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80',
 N'Tôm hùm bông tươi sống chẻ đôi, phủ lớp phô mai Mozzarella đút lò nướng vàng ươm béo ngậy.', 1, 1),

(N'Lẩu Thái hải sản chua cay thập cẩm', N'HaiSan', 365000,
 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
 N'Nước dùng lẩu hầm xương ngọt thanh cay nồng vị sả ớt, ngập tràn tôm sú, mực, ngao và cá hồi.', 1, 1),

(N'Cơm chiên hải sản hoàng kim', N'HaiSan', 115000,
 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
 N'Hạt cơm rang tơi xốp bao phủ lớp lòng đỏ trứng muối bùi béo, xào cùng tôm mực tươi ngon.', 0, 1),

(N'Mì Ý hải sản sốt Marinara cay', N'HaiSan', 135000,
 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
 N'Sợi mì spaghetti dai ngon nấu cùng tôm, vẹm xanh, mực tươi trong nước sốt cà chua thảo mộc thơm nồng.', 0, 1),

(N'Cua hoàng đế hấp bia nước dừa', N'HaiSan', 520000,
 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=600&q=80',
 N'Cua hoàng đế tươi sống hấp bia cùng nước dừa xiêm, thịt cua ngọt tự nhiên chắc nịch thơm ngậy.', 1, 1),

(N'Hàu nướng phô mai bơ tỏi', N'HaiSan', 189000,
 'https://images.unsplash.com/photo-1758972573163-0b41f3691422?auto=format&fit=crop&w=600&q=80',
 N'Hàu sữa béo mập nướng than hoa phủ lớp phô mai Mozzarella kéo sợi và sốt bơ tỏi phi thơm phức.', 1, 1),

-- ===== 4. MÓN CHAY (7 món) =====
(N'Đậu hũ non sốt nấm truffle', N'MonChay', 125000,
 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
 N'Đậu hũ non mịn mềm chiên sơ lướt ván, rưới sốt nấm hương và tinh dầu nấm truffle quý giá thơm lừng.', 1, 1),

(N'Cơm chiên ngũ sắc chay hạt sen', N'MonChay', 89000,
 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
 N'Cơm rang gạo lứt tơi xốp kết hợp hạt sen Huế bùi bùi, ngô ngọt, đậu Hà Lan và nấm đông cô thanh nhẹ.', 0, 1),

(N'Lẩu nấm thập cẩm chay thanh tịnh', N'MonChay', 275000,
 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80',
 N'Nước lẩu hầm từ củ quả ngọt thanh tự nhiên, ăn kèm 8 loại nấm quý: đùi gà, linh chi, kim châm, mộc nhĩ, bào ngư.', 1, 1),

(N'Nấm đùi gà áp chảo sốt tiêu đen', N'MonChay', 115000,
 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
 N'Nấm đùi gà tươi dày thịt áp chảo xém vàng thơm nức, ngập trong nước sốt tiêu đen Phú Quốc sánh mịn.', 0, 1),

(N'Gỏi ngó sen hoa chuối chay', N'MonChay', 85000,
 'https://images.unsplash.com/photo-1684675124739-bef0072d108a?auto=format&fit=crop&w=600&q=80',
 N'Ngó sen giòn sần sật bóp thấu cùng hoa chuối non bào sợi, đậu hũ chiên giòn, rau răm và nước mắm chay chua cay.', 0, 1),

(N'Chả giò chay nấm kim châm giòn rụm', N'MonChay', 79000,
 'https://images.unsplash.com/photo-1515022376298-7333f33e704b?auto=format&fit=crop&w=600&q=80',
 N'Chả giò vỏ rế giòn tan cuốn nhân khoai môn, đậu xanh, nấm kim châm và củ sắn, chấm sốt tương ngọt béo bùi.', 0, 1),

(N'Canh rong biển hạt sen đậu hũ non', N'MonChay', 75000,
 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
 N'Canh thanh nhiệt giải độc với rong biển tươi Hàn Quốc, hạt sen bùi ngậy và đậu hũ non tan trong miệng.', 0, 1),

-- ===== 5. ĐỒ UỐNG (9 món) =====
(N'Nước ép cam sành tươi nguyên chất', N'DoUong', 45000,
 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
 N'Cam sành tươi mọng nước ép lạnh giữ trọn vẹn vitamin C và hương vị tự nhiên ngọt thanh.', 1, 1),

(N'Trà đào cam sả hạt chia mát lạnh', N'DoUong', 55000,
 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
 N'Trà ô long thượng hạng ủ lạnh kết hợp miếng đào giòn ngọt, tinh dầu sả thơm và hạt chia bổ dưỡng.', 1, 1),

(N'Sinh tố bơ sáp Đắk Lắk cốt dừa', N'DoUong', 60000,
 'https://images.unsplash.com/photo-1557753478-d111aef068be?auto=format&fit=crop&w=600&q=80',
 N'Bơ sáp dẻo quánh xay cùng sữa đặc và nước cốt dừa nguyên chất béo ngậy thơm ngon.', 0, 1),

(N'Trà sen vàng kem cheese macchiato', N'DoUong', 50000,
 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
 N'Trà hạt sen bùi béo phủ lớp kem cheese mặn mặn ngọt ngọt mịn màng phía trên.', 0, 1),

(N'Bia Sài Gòn Special ướp lạnh (330ml)', N'DoUong', 38000,
 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=600&q=80',
 N'Bia lúa mạch thơm mát lên men truyền thống, ướp xô đá lạnh sâu sảng khoái.', 0, 1),

(N'Cocktail Mojito chanh bạc hà', N'DoUong', 85000,
 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
 N'Rượu Rum trắng pha cùng chanh tươi, lá bạc hà giã dập và soda sủi tăm sảng khoái.', 0, 1),

(N'Rượu vang đỏ Chile thượng hạng (Ly)', N'DoUong', 120000,
 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
 N'Vang đỏ Cabernet Sauvignon hương thơm quả mọng chín, gỗ sồi nồng nàn quyến rũ.', 1, 1),

(N'Nước dừa xiêm Bến Tre tươi ướp lạnh', N'DoUong', 40000,
 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80',
 N'Dừa xiêm ngọt thanh mát lành nguyên trái, giải nhiệt hoàn hảo sau bữa tiệc ấm cúng.', 0, 1),

(N'Cà phê trứng Hà Nội truyền thống', N'DoUong', 55000,
 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
 N'Cà phê phin Robusta đậm vị quyện lớp kem lòng đỏ trứng gà ta đánh bông mịn xốp béo ngậy thơm lừng.', 1, 1),

-- ===== 6. TRÁNG MIỆNG (7 món) =====
(N'Chè khúc bạch long nhãn hạt é', N'TrangMieng', 55000,
 'https://images.unsplash.com/photo-1758779527956-0da4cd6ca77d?auto=format&fit=crop&w=600&q=80',
 N'Từng viên khúc bạch phô mai sữa mềm dẻo ngậy béo, ăn cùng long nhãn ngọt thanh và hạt hạnh nhân lát.', 1, 1),

(N'Bánh flan caramel cốt dừa', N'TrangMieng', 45000,
 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80',
 N'Bánh flan mềm mịn không rỗ, phủ lớp caramel đắng nhẹ thơm thoảng hương cốt dừa béo ngậy.', 0, 1),

(N'Trái cây nhiệt đới tươi theo mùa', N'TrangMieng', 75000,
 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
 N'Đĩa trái cây tươi gồm dưa lưới, xoài cát, nho Mỹ, dâu tây Đà Lạt cắt tỉa nghệ thuật.', 0, 1),

(N'Kem dừa Xiêm béo ngậy xôi lá dứa', N'TrangMieng', 50000,
 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80',
 N'Kem dừa đựng trong trái dừa xiêm tươi, kèm xôi lá dứa dẻo thơm, dừa non nạo và lạc rang bùi.', 1, 1),

(N'Bánh Tiramisu phô mai Mascarpone Ý', N'TrangMieng', 65000,
 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
 N'Từng lớp bánh Savoiardi ngấm cà phê Espresso đậm đà xem kẽ kem phô mai Ý mềm mịn tan chảy.', 0, 1),

(N'Bánh sừng bò nướng bơ Pháp Croissant', N'TrangMieng', 40000,
 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
 N'Bánh sừng bò nhiều lớp xốp giòn nướng thơm phức bơ Isigny Pháp hảo hạng.', 0, 1),

(N'Panna Cotta dâu tây tươi sốt mâm xôi', N'TrangMieng', 55000,
 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
 N'Thạch sữa kiểu Ý núng nính ngọt ngào phủ nước sốt dâu tây chua nhẹ cực kỳ dễ chịu.', 0, 1);
GO

-- =============================================
-- NẠP DỮ LIỆU MẪU: ĐƠN ĐẶT BÀN & THỐNG KÊ DOANH THU
-- =============================================
INSERT INTO DonDatBan (MaDatBan, TaiKhoanId, BanAnId, NgayDat, NgayDen, SoNguoi, GhiChu, TrangThai, TienCoc, TrangThaiCoc) VALUES
('PN-20261020-001', 3, 5, DATEADD(day, -3, GETDATE()), DATEADD(day, -3, GETDATE()), 6, N'Sinh nhật bạn thân, cần không gian riêng tư', N'HoanThanh', 300000, N'DaThanhToan'),
('PN-20261021-002', 3, 8, DATEADD(day, -2, GETDATE()), DATEADD(day, -2, GETDATE()), 4, N'Gia đình có bé nhỏ, cần chuẩn bị ghế trẻ em', N'HoanThanh', 150000, N'DaThanhToan'),
('PN-20261022-003', 3, 2, DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), 4, N'Bàn gần cửa sổ đón gió mát', N'DaXacNhan', 100000, N'DaThanhToan'),
('PN-20261023-004', 3, 1, GETDATE(), DATEADD(hour, 2, GETDATE()), 2, N'Kỷ niệm ngày cưới, setup nến và hoa tươi', N'ChoDuyet', 50000, N'ChuaThanhToan');
GO

-- Chi tiết món đặt trước cho các đơn mẫu
INSERT INTO ChiTietDatMon (DonDatBanId, MonAnId, SoLuong, DonGia) VALUES
(1, 1, 2, 65000),   -- Gỏi cuốn
(1, 8, 2, 185000),  -- Bò nướng lá lốt
(1, 23, 1, 365000), -- Lẩu Thái
(1, 42, 4, 55000),  -- Trà đào cam sả
(2, 3, 2, 55000),   -- Soup bí đỏ
(2, 20, 1, 245000), -- Cá hồi Nauy
(3, 9, 2, 265000),  -- Bò bít tết
(3, 46, 2, 120000); -- Vang đỏ
GO

PRINT N'======================================================';
PRINT N'ĐÃ TẠO DATABASE NhaHangDB VÀ NẠP DỮ LIỆU THÀNH CÔNG!';
PRINT N'- Tài khoản mẫu: 3 tài khoản (Admin, Nhân viên, Khách hàng)';
PRINT N'- Bàn ăn mẫu: 20 bàn chuẩn (B01 đến B20, Khu A/B/VIP)';
PRINT N'- Thực đơn: 50 món ăn chuẩn 6 danh mục sắc nét';
PRINT N'- Đơn đặt bàn mẫu: 4 đơn đầy đủ dữ liệu thống kê';
PRINT N'======================================================';
GO
