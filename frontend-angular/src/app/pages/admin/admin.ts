import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatbanService } from '../../services/datban.service';
import { BanService } from '../../services/ban.service';
import { MonanService } from '../../services/monan.service';
import { BanAn } from '../../models/ban-an';
import { MonAn } from '../../models/mon-an';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {
  tab = 'dashboard';

  // Dashboard
  thongKe: any = {};
  doanhThuThang: any[] = [];

  // Dat ban
  dsDonDatBan: any[] = [];
  ngayLocDon = '';

  // Ban an
  dsBanAn: BanAn[] = [];
  dangSuaBan = false;
  formBan: any = { tenBan:'', loai:'KhuA', sucChua:4, moTa:'', hinh:'', tienCoc:100000 };
  banDangSuaId = 0;

  // Mon an
  dsMonAn: MonAn[] = [];
  danhMucLocMon = 'TatCa';
  dangSuaMon = false;
  formMon: any = { tenMon:'', danhMuc:'MonChinh', gia:0, hinh:'', moTa:'', noiBat:false, conHang:true };
  monDangSuaId = 0;

  // Tai khoan
  dsTaiKhoan: any[] = [];
  dangSuaTaiKhoan = false;
  taiKhoanDangSuaId = 0;
  formTaiKhoan: any = { hoTen: '', email: '', soDienThoai: '', matKhau: '', vaiTro: 'Staff' };
  cacVaiTro = [
    { key: 'Customer', ten: 'Khách hàng' },
    { key: 'Staff', ten: 'Nhân viên' },
    { key: 'Admin', ten: 'Quản trị viên' }
  ];

  dangTai = true;
  cheDoToi = false;
  hienMenuAdmin = false;
  tuKhoa = '';
  namHienTai = new Date().getFullYear();

  cacLoaiBan = [
    { key: 'KhuA', ten: '🏛️ Khu vực A' },
    { key: 'KhuB', ten: '🌿 Khu vực B' },
    { key: 'VIP', ten: '👑 Khu VIP' }
  ];
  cacDanhMucMon = [
    { key:'TatCa', ten:'Tất cả' },
    { key:'KhaiVi', ten:'Khai vị' },
    { key:'MonChinh', ten:'Món chính' },
    { key:'HaiSan', ten:'Hải sản' },
    { key:'MonChay', ten:'Món chay' },
    { key:'DoUong', ten:'Đồ uống' },
    { key:'TrangMieng', ten:'Tráng miệng' }
  ];
  cacTrangThaiDon = ['ChoDuyet','DaXacNhan','DangAn','HoanThanh','DaHuy'];

  constructor(
    public auth: AuthService,
    private router: Router,
    private datbanService: DatbanService,
    private banService: BanService,
    private monanService: MonanService,
    private cdr: ChangeDetectorRef
  ) {
    this.taiDuLieu();
  }

  get emailAdmin() { return this.auth.layNguoiDung()?.email ?? ''; }
  get tenAdmin() { return this.auth.layNguoiDung()?.hoTen ?? 'Admin'; }

  taiDuLieu() {
    this.dangTai = true;
    this.taiThongKe();
    this.taiDonDatBan();
    this.taiBanAn();
    this.taiMonAn();
    if (this.auth.laQuanLy()) this.taiTaiKhoan();
  }

  // ===== DASHBOARD =====
  taiThongKe() {
    this.datbanService.layThongKe().subscribe({ next: d => { this.thongKe = d; this.cdr.detectChanges(); }, error: () => {} });
    this.datbanService.layDoanhThuThang().subscribe({
      next: d => {
        // Chuẩn hóa đầy đủ 12 tháng từ T1 đến T12
        const mapDoanhThu: { [key: number]: number } = {};
        if (Array.isArray(d)) {
          d.forEach((item: any) => {
            const thangNum = Number(item.thangSo || item.thang);
            if (thangNum >= 1 && thangNum <= 12) {
              mapDoanhThu[thangNum] = item.doanhThu || 0;
            }
          });
        }
        this.doanhThuThang = Array.from({ length: 12 }, (_, i) => {
          const thangSo = i + 1;
          return {
            thangSo,
            thang: thangSo.toString(),
            doanhThu: mapDoanhThu[thangSo] || 0
          };
        });
        this.dangTai = false;
        this.cdr.detectChanges();
      },
      error: () => { this.dangTai = false; this.cdr.detectChanges(); }
    });
  }

  // ===== DON DAT BAN =====
  taiDonDatBan() {
    this.datbanService.layTatCa(this.ngayLocDon || undefined).subscribe({
      next: ds => { this.dsDonDatBan = ds; this.cdr.detectChanges(); }, error: () => {}
    });
  }

  locDonTheoNgay() { this.taiDonDatBan(); }

  capNhatTrangThaiDon(don: any) {
    this.datbanService.capNhatTrangThai(don.id, don.trangThai).subscribe({
      next: () => {
        alert('Cập nhật trạng thái thành công!');
        this.taiDonDatBan();
        this.taiThongKe();
        this.taiBanAn(); // Cập nhật lại số lượng và trạng thái bàn trống
      },
      error: () => alert('Cập nhật thất bại!')
    });
  }

  tenTrangThai(tt: string): string {
    const m: any = { ChoDuyet:'Chờ duyệt', DaXacNhan:'Đã xác nhận', DangAn:'Đang phục vụ', HoanThanh:'Hoàn thành', DaHuy:'Đã hủy' };
    return m[tt] || tt;
  }

  mauTrangThai(tt: string): string {
    const m: any = { ChoDuyet:'badge-cho', DaXacNhan:'badge-xacnhan', DangAn:'badge-dangphucvu', HoanThanh:'badge-hoan', DaHuy:'badge-huy' };
    return m[tt] || 'badge-cho';
  }

  tenTrangThaiBan(tt: string): string {
    const m: any = { Trong: 'Trống', DaDat: 'Đã đặt', DangPhucVu: 'Đang sử dụng', BaoDuong: 'Đang bảo trì' };
    return m[tt] || tt;
  }

  mauTrangThaiBan(tt: string): string {
    const m: any = { Trong: 'badge-xacnhan', DaDat: 'badge-cho', DangPhucVu: 'badge-dangphucvu', BaoDuong: 'badge-khongkhadung' };
    return m[tt] || 'badge-cho';
  }

  get maxDoanhThu(): number {
    if (!this.doanhThuThang.length) return 1;
    return Math.max(...this.doanhThuThang.map((m: any) => m.doanhThu || 0)) || 1;
  }

  get dsDonLoc() {
    if (!this.tuKhoa.trim()) return this.dsDonDatBan;
    const kw = this.tuKhoa.toLowerCase();
    return this.dsDonDatBan.filter(d =>
      d.maDatBan?.toLowerCase().includes(kw) ||
      d.hoTenKhach?.toLowerCase().includes(kw) ||
      d.tenBan?.toLowerCase().includes(kw) ||
      d.sdtKhach?.toLowerCase().includes(kw) ||
      d.soDienThoai?.toLowerCase().includes(kw)
    );
  }

  tenTrangThaiCoc(tt: string): string {
    const map: any = { DaThanhToan: 'Đã thanh toán', KhongCanCoc: 'Không cần cọc', ChuaThanhToan: 'Chưa thanh toán' };
    return map[tt] || tt || 'Chưa thanh toán';
  }

  // Xuất file Excel (.xlsx) chuẩn OpenXML: Mở trực tiếp trên Microsoft Excel xem được luôn, không cảnh báo, không lỗi font
  xuatExcelDonDatBan() {
    if (!this.dsDonLoc || this.dsDonLoc.length === 0) {
      alert('Không có dữ liệu đơn đặt bàn để xuất file!');
      return;
    }

    const d = new Date();
    const nam = d.getFullYear();
    const thang = String(d.getMonth() + 1).padStart(2, '0');
    const ngay = String(d.getDate()).padStart(2, '0');
    const gio = String(d.getHours()).padStart(2, '0');
    const phut = String(d.getMinutes()).padStart(2, '0');

    const headers = [
      'STT',
      'Mã Đặt Bàn',
      'Họ Tên Khách',
      'Số Điện Thoại',
      'Email',
      'Bàn Ăn',
      'Loại Bàn',
      'Thời Gian Đến',
      'Số Lượng Khách',
      'Tiền Cọc (VNĐ)',
      'Trạng Thái Cọc',
      'Trạng Thái Đơn',
      'Thời Gian Đặt',
      'Ghi Chú'
    ];

    const rows = this.dsDonLoc.map((don, idx) => [
      idx + 1,
      don.maDatBan || '',
      don.hoTenKhach || '',
      don.sdtKhach || don.soDienThoai || '',
      don.emailKhach || '',
      don.tenBan || ('Bàn #' + don.banAnId),
      this.tenLoaiBan(don.loaiBan),
      don.ngayDen || '',
      don.soNguoi || 1,
      don.tienCoc || 0,
      this.tenTrangThaiCoc(don.trangThaiCoc),
      this.tenTrangThai(don.trangThai),
      don.ngayDat || '',
      don.ghiChu || ''
    ]);

    const aoa = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Căn độ rộng cột rộng rãi, ngăn chặn lỗi ### khi hiển thị ngày giờ trong Excel
    ws['!cols'] = [
      { wch: 6 },   // STT
      { wch: 20 },  // Mã Đặt Bàn
      { wch: 22 },  // Họ Tên Khách
      { wch: 16 },  // Số Điện Thoại
      { wch: 24 },  // Email
      { wch: 24 },  // Bàn Ăn
      { wch: 16 },  // Loại Bàn
      { wch: 22 },  // Thời Gian Đến
      { wch: 14 },  // Số Lượng Khách
      { wch: 18 },  // Tiền Cọc
      { wch: 18 },  // Trạng Thái Cọc
      { wch: 18 },  // Trạng Thái Đơn
      { wch: 22 },  // Thời Gian Đặt
      { wch: 30 }   // Ghi Chú
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách Đặt Bàn');
    XLSX.writeFile(wb, `DonDatBan_NhaHangPhuongNam_${nam}${thang}${ngay}_${gio}${phut}.xlsx`);
  }

  // ===== BAN AN =====
  taiBanAn() {
    this.banService.layTatCa().subscribe({ next: ds => { this.dsBanAn = ds; this.cdr.detectChanges(); }, error: () => {} });
  }

  batDauThemBan() {
    this.dangSuaBan = false;
    this.banDangSuaId = 0;
    this.formBan = { tenBan:'', loai:'KhuA', sucChua:4, moTa:'', hinh:'', tienCoc:100000 };
  }

  batDauSuaBan(ban: BanAn) {
    this.dangSuaBan = true;
    this.banDangSuaId = ban.id;
    this.formBan = { tenBan: ban.tenBan, loai: ban.loai, sucChua: ban.sucChua, moTa: ban.moTa, hinh: ban.hinh, tienCoc: ban.tienCoc };
    this.tab = 'ban';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  luuBan() {
    if (!this.formBan.tenBan.trim()) { alert('Vui lòng nhập tên bàn!'); return; }
    if (!this.formBan.hinh || !this.formBan.hinh.trim()) {
      this.formBan.hinh = this.formBan.sucChua <= 2
        ? 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
        : this.formBan.sucChua <= 4
        ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
        : this.formBan.sucChua <= 6
        ? 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80';
    }
    const obs = this.dangSuaBan
      ? this.banService.suaBan(this.banDangSuaId, this.formBan)
      : this.banService.themBan(this.formBan);
    obs.subscribe({
      next: () => { alert(this.dangSuaBan ? 'Cập nhật bàn thành công!' : 'Thêm bàn thành công!'); this.taiBanAn(); this.batDauThemBan(); },
      error: () => alert('Lưu bàn thất bại!')
    });
  }

  xoaBan(id: number) {
    if (!confirm('Xóa bàn này?')) return;
    this.banService.xoaBan(id).subscribe({ next: () => { alert('Đã xóa!'); this.taiBanAn(); }, error: () => alert('Xóa thất bại!') });
  }

  doiTrangThaiBan(ban: BanAn) {
    this.banService.doiTrangThai(ban.id, ban.trangThai).subscribe({ next: () => this.taiBanAn(), error: () => {} });
  }

  tenLoaiBan(l: string): string {
    const m: any = {
      KhuA: 'Khu vực A',
      KhuB: 'Khu vực B',
      VIP: 'Khu VIP',
      Thuong: 'Khu vực A',
      SanVuon: 'Khu vực B',
      NgoaiTroi: 'Khu vực B'
    };
    return m[l] || l;
  }

  // ===== MON AN =====
  taiMonAn() {
    this.monanService.layTatCa(this.danhMucLocMon).subscribe({ next: ds => { this.dsMonAn = ds; this.cdr.detectChanges(); }, error: () => {} });
  }

  locMonTheoMuc() { this.taiMonAn(); }

  batDauThemMon() {
    this.dangSuaMon = false;
    this.monDangSuaId = 0;
    this.formMon = { tenMon:'', danhMuc:'MonChinh', gia:0, hinh:'', moTa:'', noiBat:false, conHang:true };
  }

  batDauSuaMon(mon: MonAn) {
    this.dangSuaMon = true;
    this.monDangSuaId = mon.id;
    this.formMon = { tenMon: mon.tenMon, danhMuc: mon.danhMuc, gia: mon.gia, hinh: mon.hinh, moTa: mon.moTa, noiBat: mon.noiBat, conHang: mon.conHang };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  luuMon() {
    if (!this.formMon.tenMon.trim()) { alert('Vui lòng nhập tên món!'); return; }
    if (this.formMon.gia <= 0) { alert('Giá phải lớn hơn 0!'); return; }
    const obs = this.dangSuaMon
      ? this.monanService.suaMon(this.monDangSuaId, this.formMon)
      : this.monanService.themMon(this.formMon);
    obs.subscribe({
      next: () => { alert(this.dangSuaMon ? 'Cập nhật thành công!' : 'Thêm thành công!'); this.taiMonAn(); this.batDauThemMon(); },
      error: () => alert('Lưu món thất bại!')
    });
  }

  xoaMon(id: number) {
    if (!confirm('Xóa món này?')) return;
    this.monanService.xoaMon(id).subscribe({ next: () => { alert('Đã xóa!'); this.taiMonAn(); }, error: () => alert('Xóa thất bại!') });
  }

  tenDanhMuc(dm: string): string {
    const m: any = {
      KhaiVi: 'Khai vị',
      MonChinh: 'Món chính',
      HaiSan: 'Hải sản',
      MonChay: 'Món chay',
      TrangMieng: 'Tráng miệng',
      DoUong: 'Đồ uống'
    };
    return m[dm] || dm;
  }

  // ===== TAI KHOAN =====
  taiTaiKhoan() {
    this.auth.layTatCaTaiKhoan().subscribe({
      next: ds => {
        this.dsTaiKhoan = Array.isArray(ds) ? ds : [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  batDauThemTaiKhoan() {
    this.dangSuaTaiKhoan = false;
    this.taiKhoanDangSuaId = 0;
    this.formTaiKhoan = { hoTen: '', email: '', soDienThoai: '', matKhau: '', vaiTro: 'Staff' };
  }

  batDauSuaTaiKhoan(tk: any) {
    this.dangSuaTaiKhoan = true;
    this.taiKhoanDangSuaId = tk.id;
    this.formTaiKhoan = {
      hoTen: tk.hoTen,
      email: tk.email,
      soDienThoai: tk.soDienThoai || '',
      vaiTro: tk.vaiTro || 'Customer'
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  luuTaiKhoan() {
    if (!this.formTaiKhoan.hoTen?.trim()) {
      alert('Vui lòng nhập họ và tên!');
      return;
    }

    if (this.dangSuaTaiKhoan) {
      this.auth.capNhatTaiKhoan(this.taiKhoanDangSuaId, {
        hoTen: this.formTaiKhoan.hoTen,
        soDienThoai: this.formTaiKhoan.soDienThoai,
        vaiTro: this.formTaiKhoan.vaiTro
      }).subscribe({
        next: () => {
          alert('Cập nhật tài khoản thành công!');
          this.taiTaiKhoan();
          this.batDauThemTaiKhoan();
        },
        error: (err: any) => alert(err.error?.message || 'Cập nhật tài khoản thất bại!')
      });
    } else {
      if (!this.formTaiKhoan.email?.trim()) {
        alert('Vui lòng nhập email!');
        return;
      }
      this.auth.taoTaiKhoan(this.formTaiKhoan).subscribe({
        next: () => {
          alert('Tạo tài khoản thành công!');
          this.taiTaiKhoan();
          this.batDauThemTaiKhoan();
        },
        error: (err: any) => alert(err.error?.message || 'Tạo tài khoản thất bại!')
      });
    }
  }

  doiVaiTro(tk: any, vaiTroMoi: string) {
    if (tk.vaiTro === vaiTroMoi) return;
    this.auth.capNhatTaiKhoan(tk.id, {
      hoTen: tk.hoTen,
      soDienThoai: tk.soDienThoai,
      vaiTro: vaiTroMoi
    }).subscribe({
      next: () => {
        tk.vaiTro = vaiTroMoi;
        alert(`Đã cập nhật vai trò thành công: ${this.tenVaiTro(vaiTroMoi)}!`);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert(err.error?.message || 'Không thể đổi vai trò!');
        this.taiTaiKhoan();
      }
    });
  }

  doiTrangThaiKhoa(tk: any) {
    const hanhDong = tk.trangThai === 'BiKhoa' ? 'mở khóa' : 'khóa';
    if (!confirm(`Bạn có chắc muốn ${hanhDong} tài khoản "${tk.hoTen}" không?`)) return;

    const trangThaiMoi = tk.trangThai === 'BiKhoa' ? 'HoatDong' : 'BiKhoa';
    this.auth.doiTrangThaiTaiKhoan(tk.id, trangThaiMoi).subscribe({
      next: () => {
        tk.trangThai = trangThaiMoi;
        alert(`Đã ${hanhDong} tài khoản thành công!`);
        this.cdr.detectChanges();
      },
      error: (err: any) => alert(err.error?.message || `Thao tác thất bại!`)
    });
  }

  tenVaiTro(vt: string): string {
    const map: any = {
      Admin: 'Quản trị viên',
      QuanLy: 'Quản trị viên',
      Staff: 'Nhân viên',
      NhanVien: 'Nhân viên',
      Customer: 'Khách hàng',
      KhachHang: 'Khách hàng'
    };
    return map[vt] || vt;
  }

  // ===== CHUNG =====
  dangXuat() { this.auth.dangXuat(); this.router.navigate(['/dang-nhap']); }

  formatGia(g: number): string { return (g || 0).toLocaleString('vi-VN') + 'đ'; }
  formatGiaNgan(g: number): string {
    if (!g) return '0đ';
    if (g >= 1000000) return (g / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (g >= 1000) return (g / 1000).toFixed(0) + 'k';
    return (g || 0).toLocaleString('vi-VN') + 'đ';
  }
}
