-- ====================================================================
-- HỆ THỐNG QUẢN LÝ VÀ ĐẶT BÀN NHÀ HÀNG PHƯƠNG NAM
-- SCRIPT CẬP NHẬT DỮ LIỆU CHUẨN: 50 MÓN ĂN & 20 BÀN ĂN
-- CSDL: NhaHangDB
-- ====================================================================

USE NhaHangDB;
GO

SET NOCOUNT ON;
GO

PRINT N'======================================================';
PRINT N'BẮT ĐẦU CẬP NHẬT DỮ LIỆU: 20 BÀN ĂN & 50 MÓN ĂN';
PRINT N'======================================================';
GO

-- ====================================================================
-- PHẦN 1: CẬP NHẬT 20 BÀN ĂN (MÃ TỪ B01 ĐẾN B20)
-- Khu vực: KhuA, KhuB, VIP
-- Sức chứa: 2 đến 8 người
-- Trạng thái: Trong (Trống), DaDat (Đã đặt), DangPhucVu (Đang sử dụng), BaoDuong (Đang bảo trì)
-- ====================================================================

-- 1. Cập nhật 10 bàn đầu tiên (Id 1 đến 10) nếu đã tồn tại
IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 1)
    UPDATE BanAn SET TenBan = N'B01 - Bàn 2 khách Khu A', Loai = N'KhuA', SucChua = 2, TrangThai = N'Trong', MoTa = N'Bàn đôi riêng tư cạnh cửa sổ thoáng mát, Khu vực A', Hinh = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', TienCoc = 50000 WHERE Id = 1;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 2)
    UPDATE BanAn SET TenBan = N'B02 - Bàn 2 khách Khu A', Loai = N'KhuA', SucChua = 2, TrangThai = N'Trong', MoTa = N'Bàn 2 người lãng mạn ánh sáng nhẹ nhàng, Khu vực A', Hinh = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80', TienCoc = 50000 WHERE Id = 2;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 3)
    UPDATE BanAn SET TenBan = N'B03 - Bàn 4 khách Khu A', Loai = N'KhuA', SucChua = 4, TrangThai = N'Trong', MoTa = N'Bàn 4 người ghế bọc da êm ái, trung tâm Khu vực A', Hinh = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80', TienCoc = 100000 WHERE Id = 3;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 4)
    UPDATE BanAn SET TenBan = N'B04 - Bàn 4 khách Khu A', Loai = N'KhuA', SucChua = 4, TrangThai = N'DaDat', MoTa = N'Bàn 4 người gia đình ấm cúng, Khu vực A', Hinh = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', TienCoc = 100000 WHERE Id = 4;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 5)
    UPDATE BanAn SET TenBan = N'B05 - Bàn 6 khách Khu A', Loai = N'KhuA', SucChua = 6, TrangThai = N'Trong', MoTa = N'Bàn tròn 6 khách phù hợp tụ họp bạn bè, Khu vực A', Hinh = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', TienCoc = 150000 WHERE Id = 5;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 6)
    UPDATE BanAn SET TenBan = N'B06 - Bàn 6 khách Khu A', Loai = N'KhuA', SucChua = 6, TrangThai = N'DangPhucVu', MoTa = N'Bàn dài 6 khách không gian sảnh chính, Khu vực A', Hinh = 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80', TienCoc = 150000 WHERE Id = 6;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 7)
    UPDATE BanAn SET TenBan = N'B07 - Bàn 8 khách Khu A', Loai = N'KhuA', SucChua = 8, TrangThai = N'Trong', MoTa = N'Bàn tiệc lớn 8 khách rộng rãi sảnh tiệc, Khu vực A', Hinh = 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=600&q=80', TienCoc = 200000 WHERE Id = 7;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 8)
    UPDATE BanAn SET TenBan = N'B08 - Bàn 2 khách Khu B', Loai = N'KhuB', SucChua = 2, TrangThai = N'Trong', MoTa = N'Bàn đôi ngắm cảnh sân vườn xanh mát, Khu vực B', Hinh = 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80', TienCoc = 60000 WHERE Id = 8;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 9)
    UPDATE BanAn SET TenBan = N'B09 - Bàn 4 khách Khu B', Loai = N'KhuB', SucChua = 4, TrangThai = N'Trong', MoTa = N'Bàn 4 khách cạnh tiểu cảnh nước và hoa, Khu vực B', Hinh = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80', TienCoc = 100000 WHERE Id = 9;

IF EXISTS (SELECT 1 FROM BanAn WHERE Id = 10)
    UPDATE BanAn SET TenBan = N'B10 - Bàn 4 khách Khu B', Loai = N'KhuB', SucChua = 4, TrangThai = N'Trong', MoTa = N'Bàn 4 khách không gian mở ngoài trời mát mẻ, Khu vực B', Hinh = 'https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?auto=format&fit=crop&w=600&q=80', TienCoc = 100000 WHERE Id = 10;

-- 2. Thêm hoặc cập nhật các bàn từ B11 đến B20
IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B11%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B11 - Bàn 6 khách Khu B', N'KhuB', 6, N'DangPhucVu', N'Bàn 6 người sân vườn có đèn trang trí lung linh buổi tối, Khu vực B', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80', 150000);
ELSE
    UPDATE BanAn SET Loai = N'KhuB', SucChua = 6, TrangThai = N'DangPhucVu', MoTa = N'Bàn 6 người sân vườn có đèn trang trí lung linh buổi tối, Khu vực B', TienCoc = 150000 WHERE TenBan LIKE N'B11%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B12%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B12 - Bàn 6 khách Khu B', N'KhuB', 6, N'Trong', N'Bàn 6 người ban công tầng lửng đón gió tự nhiên, Khu vực B', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80', 150000);
ELSE
    UPDATE BanAn SET Loai = N'KhuB', SucChua = 6, TrangThai = N'Trong', MoTa = N'Bàn 6 người ban công tầng lửng đón gió tự nhiên, Khu vực B', TienCoc = 150000 WHERE TenBan LIKE N'B12%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B13%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B13 - Bàn 8 khách Khu B', N'KhuB', 8, N'Trong', N'Bàn tiệc ngoài trời 8 khách view toàn cảnh lung linh, Khu vực B', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80', 200000);
ELSE
    UPDATE BanAn SET Loai = N'KhuB', SucChua = 8, TrangThai = N'Trong', MoTa = N'Bàn tiệc ngoài trời 8 khách view toàn cảnh lung linh, Khu vực B', TienCoc = 200000 WHERE TenBan LIKE N'B13%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B14%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B14 - Bàn 8 khách Khu B', N'KhuB', 8, N'BaoDuong', N'Bàn 8 khách khu vực sân thượng (đang nâng cấp ánh sáng cảnh quan)', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80', 200000);
ELSE
    UPDATE BanAn SET Loai = N'KhuB', SucChua = 8, TrangThai = N'BaoDuong', MoTa = N'Bàn 8 khách khu vực sân thượng (đang nâng cấp ánh sáng cảnh quan)', TienCoc = 200000 WHERE TenBan LIKE N'B14%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B15%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B15 - Bàn VIP 2 khách Hoàng Gia', N'VIP', 2, N'Trong', N'Phòng VIP Hoàng Gia 2 khách, hoa tươi và nhạc acoustic theo yêu cầu', 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80', 150000);
ELSE
    UPDATE BanAn SET Loai = N'VIP', SucChua = 2, TrangThai = N'Trong', MoTa = N'Phòng VIP Hoàng Gia 2 khách, hoa tươi và nhạc acoustic theo yêu cầu', TienCoc = 150000 WHERE TenBan LIKE N'B15%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B16%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B16 - Bàn VIP 4 khách Kim Cương', N'VIP', 4, N'Trong', N'Phòng VIP Kim Cương 4 khách, cách âm tuyệt đối, nội thất hoàng gia cao cấp', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80', 250000);
ELSE
    UPDATE BanAn SET Loai = N'VIP', SucChua = 4, TrangThai = N'Trong', MoTa = N'Phòng VIP Kim Cương 4 khách, cách âm tuyệt đối, nội thất hoàng gia cao cấp', TienCoc = 250000 WHERE TenBan LIKE N'B16%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B17%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B17 - Bàn VIP 4 khách Ruby', N'VIP', 4, N'DaDat', N'Phòng VIP Ruby 4 khách phong cách tân cổ điển, có nhân viên phục vụ riêng', 'https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?auto=format&fit=crop&w=600&q=80', 250000);
ELSE
    UPDATE BanAn SET Loai = N'VIP', SucChua = 4, TrangThai = N'DaDat', MoTa = N'Phòng VIP Ruby 4 khách phong cách tân cổ điển, có nhân viên phục vụ riêng', TienCoc = 250000 WHERE TenBan LIKE N'B17%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B18%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B18 - Bàn VIP 6 khách Sapphire', N'VIP', 6, N'Trong', N'Phòng VIP Sapphire 6 khách đón tiếp đối tác kinh doanh trang trọng', 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80', 350000);
ELSE
    UPDATE BanAn SET Loai = N'VIP', SucChua = 6, TrangThai = N'Trong', MoTa = N'Phòng VIP Sapphire 6 khách đón tiếp đối tác kinh doanh trang trọng', TienCoc = 350000 WHERE TenBan LIKE N'B18%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B19%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B19 - Bàn VIP 8 khách Emerald', N'VIP', 8, N'DangPhucVu', N'Phòng VIP Emerald 8 khách có bàn xoay tiện nghi, hướng nhìn phố lung linh', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80', 500000);
ELSE
    UPDATE BanAn SET Loai = N'VIP', SucChua = 8, TrangThai = N'DangPhucVu', MoTa = N'Phòng VIP Emerald 8 khách có bàn xoay tiện nghi, hướng nhìn phố lung linh', TienCoc = 500000 WHERE TenBan LIKE N'B19%';

IF NOT EXISTS (SELECT 1 FROM BanAn WHERE TenBan LIKE N'B20%')
    INSERT INTO BanAn (TenBan, Loai, SucChua, TrangThai, MoTa, Hinh, TienCoc) VALUES
    (N'B20 - Bàn VIP 8 khách Thượng Đỉnh', N'VIP', 8, N'Trong', N'Đại sảnh VIP Thượng Đỉnh 8 khách, hệ thống karaoke cao cấp và ban công riêng', 'https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?auto=format&fit=crop&w=600&q=80', 500000);
ELSE
    UPDATE BanAn SET Loai = N'VIP', SucChua = 8, TrangThai = N'Trong', MoTa = N'Đại sảnh VIP Thượng Đỉnh 8 khách, hệ thống karaoke cao cấp và ban công riêng', TienCoc = 500000 WHERE TenBan LIKE N'B20%';

GO
PRINT N'-> Đã hoàn thành cập nhật 20 bàn ăn (B01 đến B20).';
GO

-- ====================================================================
-- PHẦN 2: CẬP NHẬT 50 MÓN ĂN VÀ 6 DANH MỤC
-- Danh mục:
-- 1. KhaiVi: Khai vị (7 món)
-- 2. MonChinh: Món chính (10 món)
-- 3. HaiSan: Hải sản (10 món)
-- 4. MonChay: Món chay (7 món)
-- 5. DoUong: Đồ uống (9 món)
-- 6. TrangMieng: Tráng miệng (7 món)
-- Tổng: 50 món
-- ====================================================================

-- 1. Cập nhật phân loại danh mục chuẩn cho các món hiện có
-- Chuyển các món hải sản sang danh mục 'HaiSan'
UPDATE MonAn SET DanhMuc = N'HaiSan', MoTa = N'Vỏ chả giò rế chiên vàng ươm, nhân tôm sú, mực tươi, củ năng chấm sốt mayonnaise chua ngọt.' WHERE TenMon LIKE N'%Chả giò hải sản%' OR Id = 2;
UPDATE MonAn SET DanhMuc = N'HaiSan', Hinh = N'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', MoTa = N'Mực ống tươi cắt khoanh tẩm bột xù chiên giòn rụm, ăn kèm sốt Tartar chua thanh béo ngậy.' WHERE TenMon LIKE N'%Mực khoanh chiên giòn%' OR Id = 9;
UPDATE MonAn SET DanhMuc = N'HaiSan', MoTa = N'Phi lê cá hồi Nauy áp chảo da giòn rụm thịt mềm ngọt, ăn kèm măng tây sốt bơ chanh thanh mát.' WHERE TenMon LIKE N'%Cá hồi Nauy%' OR Id = 12;
UPDATE MonAn SET DanhMuc = N'HaiSan', MoTa = N'Tôm càng xanh tự nhiên rang muối tuyết Hồng Kông thơm cay đậm đà, thịt tôm ngọt chắc nịch.' WHERE TenMon LIKE N'%Tôm càng xanh rang muối%' OR Id = 14;
UPDATE MonAn SET DanhMuc = N'HaiSan', MoTa = N'Tôm hùm bông tươi sống chẻ đôi phủ ngập phô mai Mozzarella đút lò nướng vàng ươm béo ngậy.' WHERE TenMon LIKE N'%Tôm hùm bỏ lò phô mai%' OR Id = 15;
UPDATE MonAn SET DanhMuc = N'HaiSan', MoTa = N'Nước dùng chua cay sả ớt chuẩn vị Thái hầm cùng tôm sú, mực ống, nghêu trắng và cá hồi tươi.' WHERE TenMon LIKE N'%Lẩu Thái hải sản%' OR Id = 16;
UPDATE MonAn SET DanhMuc = N'HaiSan', MoTa = N'Cơm rang hạt tơi xốp quyện lòng đỏ trứng muối bùi béo, xào cùng tôm nõn và mực tươi xắt hạt lựu.' WHERE TenMon LIKE N'%Cơm chiên hải sản hoàng kim%' OR Id = 19;
UPDATE MonAn SET DanhMuc = N'HaiSan', MoTa = N'Mì Ý spaghetti dai ngon sốt cà chua Marinara nấu cùng vẹm xanh New Zealand, tôm tươi và mực.' WHERE TenMon LIKE N'%Mì Ý hải sản%' OR Id = 23;

-- Cập nhật danh mục Khai vị (KhaiVi)
UPDATE MonAn SET DanhMuc = N'KhaiVi' WHERE Id IN (1, 3, 4, 5, 6, 7, 8);

-- Cập nhật danh mục Món chính (MonChinh)
UPDATE MonAn SET DanhMuc = N'MonChinh' WHERE Id IN (10, 11, 13, 17, 18, 20, 21, 22, 24, 25);

-- Cập nhật trạng thái một món tạm hết hàng để test giao diện
UPDATE MonAn SET ConHang = 0 WHERE TenMon LIKE N'%Heo quay da giòn%' OR Id = 20;

-- 2. Thêm 10 món ăn mới (2 Hải sản + 7 Món chay + 1 Đồ uống) để đạt chuẩn 50 món

-- === Thêm 2 món Hải sản mới ===
IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Cua hoàng đế hấp bia nước dừa')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Cua hoàng đế hấp bia nước dừa', N'HaiSan', 520000,
     'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=600&q=80',
     N'Cua hoàng đế tươi sống hấp bia cùng nước dừa xiêm, thịt cua ngọt tự nhiên chắc nịch thơm ngậy.', 1, 1);

IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Hàu nướng phô mai bơ tỏi')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Hàu nướng phô mai bơ tỏi', N'HaiSan', 189000,
     'https://images.unsplash.com/photo-1758972573163-0b41f3691422?auto=format&fit=crop&w=600&q=80',
     N'Hàu sữa béo mập nướng than hoa phủ lớp phô mai Mozzarella kéo sợi và sốt bơ tỏi phi thơm phức.', 1, 1);

-- === Thêm 7 Món chay thanh tịnh thơm ngon ===
IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Đậu hũ non sốt nấm truffle')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Đậu hũ non sốt nấm truffle', N'MonChay', 125000,
     'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
     N'Đậu hũ non mịn mềm chiên sơ lướt ván, rưới sốt nấm hương và tinh dầu nấm truffle quý giá thơm lừng.', 1, 1);

IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Cơm chiên ngũ sắc chay hạt sen')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Cơm chiên ngũ sắc chay hạt sen', N'MonChay', 89000,
     'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
     N'Cơm rang gạo lứt tơi xốp kết hợp hạt sen Huế bùi bùi, ngô ngọt, đậu Hà Lan và nấm đông cô thanh nhẹ.', 0, 1);

IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Lẩu nấm thập cẩm chay thanh tịnh')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Lẩu nấm thập cẩm chay thanh tịnh', N'MonChay', 275000,
     'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80',
     N'Nước lẩu hầm từ củ quả ngọt thanh tự nhiên, ăn kèm 8 loại nấm quý: đùi gà, linh chi, kim châm, mộc nhĩ, bào ngư.', 1, 1);

IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Nấm đùi gà áp chảo sốt tiêu đen')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Nấm đùi gà áp chảo sốt tiêu đen', N'MonChay', 115000,
     'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
     N'Nấm đùi gà tươi dày thịt áp chảo xém vàng thơm nức, ngập trong nước sốt tiêu đen Phú Quốc sánh mịn.', 0, 1);

IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Gỏi ngó sen hoa chuối chay')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Gỏi ngó sen hoa chuối chay', N'MonChay', 85000,
     'https://images.unsplash.com/photo-1684675124739-bef0072d108a?auto=format&fit=crop&w=600&q=80',
     N'Ngó sen giòn sần sật bóp thấu cùng hoa chuối non bào sợi, đậu hũ chiên giòn, rau răm và nước mắm chay chua cay.', 0, 1);

IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Chả giò chay nấm kim châm giòn rụm')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Chả giò chay nấm kim châm giòn rụm', N'MonChay', 79000,
     'https://images.unsplash.com/photo-1515022376298-7333f33e704b?auto=format&fit=crop&w=600&q=80',
     N'Chả giò vỏ rế giòn tan cuốn nhân khoai môn, đậu xanh, nấm kim châm và củ sắn, chấm sốt tương ngọt béo bùi.', 0, 1);

IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Canh rong biển hạt sen đậu hũ non')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Canh rong biển hạt sen đậu hũ non', N'MonChay', 75000,
     'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
     N'Canh thanh nhiệt giải độc với rong biển tươi Hàn Quốc, hạt sen bùi ngậy và đậu hũ non tan trong miệng.', 0, 1);

-- === Thêm 1 món Đồ uống mới ===
IF NOT EXISTS (SELECT 1 FROM MonAn WHERE TenMon = N'Cà phê trứng Hà Nội truyền thống')
    INSERT INTO MonAn (TenMon, DanhMuc, Gia, Hinh, MoTa, NoiBat, ConHang) VALUES
    (N'Cà phê trứng Hà Nội truyền thống', N'DoUong', 55000,
     'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
     N'Cà phê phin Robusta đậm vị quyện lớp kem lòng đỏ trứng gà ta đánh bông mịn xốp béo ngậy thơm lừng.', 1, 1);

GO
PRINT N'-> Đã hoàn thành cập nhật thực đơn và 6 danh mục chuẩn.';
GO

-- ====================================================================
-- PHẦN 3: KIỂM TRA VÀ THỐNG KÊ KẾT QUẢ CẬP NHẬT
-- ====================================================================

PRINT N'------------------------------------------------------';
PRINT N'BÁO CÁO TỔNG QUAN SAU KHI CẬP NHẬT:';
PRINT N'------------------------------------------------------';

SELECT 
    N'Tổng số bàn ăn' AS [Hạng Mục], 
    COUNT(*) AS [Số Lượng Hiện Tại], 
    N'Yêu cầu: 20 bàn (B01-B20)' AS [Ghi Chú]
FROM BanAn
UNION ALL
SELECT 
    N'Tổng số món ăn', 
    COUNT(*), 
    N'Yêu cầu: 50 món ăn'
FROM MonAn;

PRINT N'Thống kê bàn ăn theo Khu Vực:';
SELECT 
    Loai AS [Khu Vực], 
    COUNT(*) AS [Số Bàn],
    MIN(SucChua) AS [Sức Chứa Min],
    MAX(SucChua) AS [Sức Chứa Max]
FROM BanAn 
GROUP BY Loai 
ORDER BY Loai;

PRINT N'Thống kê bàn ăn theo Trạng Thái:';
SELECT 
    TrangThai AS [Trạng Thái], 
    COUNT(*) AS [Số Bàn] 
FROM BanAn 
GROUP BY TrangThai 
ORDER BY TrangThai;

PRINT N'Thống kê món ăn theo 6 Danh Mục:';
SELECT 
    DanhMuc AS [Mã Danh Mục], 
    CASE DanhMuc 
        WHEN N'KhaiVi'    THEN N'Khai vị' 
        WHEN N'MonChinh'  THEN N'Món chính' 
        WHEN N'HaiSan'    THEN N'Hải sản' 
        WHEN N'MonChay'   THEN N'Món chay' 
        WHEN N'DoUong'    THEN N'Đồ uống' 
        WHEN N'TrangMieng' THEN N'Tráng miệng' 
        ELSE DanhMuc 
    END AS [Tên Danh Mục Tiếng Việt],
    COUNT(*) AS [Số Món],
    SUM(CASE WHEN ConHang = 1 THEN 1 ELSE 0 END) AS [Còn Hàng],
    SUM(CASE WHEN ConHang = 0 THEN 1 ELSE 0 END) AS [Hết Hàng],
    SUM(CASE WHEN NoiBat = 1 THEN 1 ELSE 0 END) AS [Món Nổi Bật]
FROM MonAn 
GROUP BY DanhMuc 
ORDER BY DanhMuc;
GO

PRINT N'======================================================';
PRINT N'ĐÃ CẬP NHẬT CSDL THÀNH CÔNG VÀ AN TOÀN TUYỆT ĐỐI!';
PRINT N'======================================================';
GO

