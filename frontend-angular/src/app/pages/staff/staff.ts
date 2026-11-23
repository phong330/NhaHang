import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AuthService } from '../../services/auth.service';
import { DatbanService } from '../../services/datban.service';
import { BanService } from '../../services/ban.service';
import { BanAn } from '../../models/ban-an';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.html',
  styleUrls: ['./staff.css']
})
export class StaffComponent implements OnInit {
  tab = 'datban';
  dsDonDatBan: any[] = [];
  dsBanAn: BanAn[] = [];
  dangTai = true;
  tuKhoa = '';
  ngayLocDon = '';
  cacTrangThaiDon = ['ChoDuyet', 'DaXacNhan', 'DangAn', 'HoanThanh', 'DaHuy'];
  chiTietDon: any = null;
  hienChiTiet = false;

  constructor(
    public auth: AuthService,
    private datbanService: DatbanService,
    private banService: BanService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taiDuLieu();
  }

  taiDuLieu() {
    this.taiDonDatBan();
    this.taiBanAn();
  }

  taiDonDatBan() {
    this.dangTai = true;
    this.datbanService.layTatCa(this.ngayLocDon || undefined).subscribe({
      next: ds => { this.dsDonDatBan = ds; this.dangTai = false; this.cdr.detectChanges(); },
      error: () => { this.dangTai = false; this.cdr.detectChanges(); }
    });
  }

  taiBanAn() {
    this.banService.layTatCa().subscribe({
      next: ds => { this.dsBanAn = ds; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  locDonTheoNgay() { this.taiDonDatBan(); }

  capNhatTrangThaiDon(don: any) {
    this.datbanService.capNhatTrangThai(don.id, don.trangThai).subscribe({
      next: () => {
        alert('Cập nhật trạng thái thành công!');
        this.taiDonDatBan();
        this.taiBanAn();
      },
      error: () => alert('Cập nhật thất bại!')
    });
  }

  doiTrangThaiBan(ban: BanAn) {
    this.banService.doiTrangThai(ban.id, ban.trangThai).subscribe({
      next: () => this.taiBanAn(),
      error: () => {}
    });
  }

  xemChiTiet(don: any) {
    this.datbanService.layChiTiet(don.id).subscribe({
      next: data => {
        this.chiTietDon = data;
        this.hienChiTiet = true;
        this.cdr.detectChanges();
      },
      error: () => alert('Không thể tải chi tiết đơn!')
    });
  }

  dongChiTiet() {
    this.hienChiTiet = false;
    this.chiTietDon = null;
  }

  get dsDonLoc() {
    if (!this.tuKhoa.trim()) return this.dsDonDatBan;
    const kw = this.tuKhoa.toLowerCase();
    return this.dsDonDatBan.filter(d =>
      d.maDatBan?.toLowerCase().includes(kw) ||
      d.hoTenKhach?.toLowerCase().includes(kw) ||
      d.tenBan?.toLowerCase().includes(kw) ||
      d.sdtKhach?.toLowerCase().includes(kw)
    );
  }

  tenTrangThai(tt: string): string {
    const m: any = { ChoDuyet: 'Chờ duyệt', DaXacNhan: 'Đã xác nhận', DangAn: 'Đang phục vụ', HoanThanh: 'Hoàn thành', DaHuy: 'Đã hủy' };
    return m[tt] || tt;
  }

  tenTrangThaiCoc(tt: string): string {
    const map: any = { DaThanhToan: 'Đã thanh toán', KhongCanCoc: 'Không cần cọc', ChuaThanhToan: 'Chưa thanh toán' };
    return map[tt] || tt || 'Chưa thanh toán';
  }

  xuatExcel() {
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

    const rows = this.dsDonLoc.map((don: any, idx: number) => [
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
    XLSX.writeFile(wb, `DonDatBan_NhanVien_${nam}${thang}${ngay}_${gio}${phut}.xlsx`);
  }

  mauTrangThai(tt: string): string {
    const m: any = { ChoDuyet: 'badge-cho', DaXacNhan: 'badge-xacnhan', DangAn: 'badge-dangphucvu', HoanThanh: 'badge-hoan', DaHuy: 'badge-huy' };
    return m[tt] || 'badge-cho';
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

  tenTrangThaiBan(tt: string): string {
    const m: any = {
      Trong: 'Trống',
      DaDat: 'Đã đặt',
      DangPhucVu: 'Đang sử dụng',
      BaoDuong: 'Đang bảo trì'
    };
    return m[tt] || tt;
  }

  mauTrangThaiBan(tt: string): string {
    const m: any = { Trong: 'badge-xacnhan', DaDat: 'badge-cho', DangPhucVu: 'badge-dangphucvu', BaoDuong: 'badge-khongkhadung' };
    return m[tt] || 'badge-cho';
  }

  formatGia(g: number): string { return (g || 0).toLocaleString('vi-VN') + 'đ'; }

  dangXuat() {
    this.auth.dangXuat();
    this.router.navigate(['/dang-nhap']);
  }

  get tenNhanVien() { return this.auth.layNguoiDung()?.hoTen ?? 'Nhân viên'; }
}
