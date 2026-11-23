import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DatbanService } from '../../services/datban.service';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lich-su-dat-ban',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lich-su-dat-ban.html',
  styleUrls: ['./lich-su-dat-ban.css']
})
export class LichSuDatBanComponent implements OnInit {
  dsDon: any[] = [];
  dangTai = true;
  thongBaoLoi = '';
  tabHienTai: 'tatca' | 'hoatdong' | 'dahuy' = 'tatca';

  constructor(
    private datbanService: DatbanService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  get soDonHoatDong(): number {
    return this.dsDon.filter(d => d.trangThai !== 'DaHuy').length;
  }

  get soDonDaHuy(): number {
    return this.dsDon.filter(d => d.trangThai === 'DaHuy').length;
  }

  get dsDonHienThi(): any[] {
    if (this.tabHienTai === 'hoatdong') return this.dsDon.filter(d => d.trangThai !== 'DaHuy');
    if (this.tabHienTai === 'dahuy') return this.dsDon.filter(d => d.trangThai === 'DaHuy');
    return this.dsDon;
  }

  ngOnInit(): void {
    this.taiDuLieu();
  }

  taiDuLieu() {
    const user = this.auth.layNguoiDung();
    if (!user) {
      this.dangTai = false;
      return;
    }
    this.dangTai = true;
    this.thongBaoLoi = '';
    this.datbanService.layTheoTaiKhoan(user.id).subscribe({
      next: ds => {
        this.dsDon = Array.isArray(ds) ? ds : [];
        this.dangTai = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.dangTai = false;
        this.thongBaoLoi = 'Chưa thể kết nối để lấy danh sách đặt bàn.';
        this.cdr.detectChanges();
      }
    });
  }

  huyDon(id: number) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn đặt bàn này không?')) return;
    this.datbanService.capNhatTrangThai(id, 'DaHuy').subscribe({
      next: () => {
        alert('Đã hủy đặt bàn thành công!');
        this.taiDuLieu();
      },
      error: () => alert('Hủy đặt bàn thất bại! Vui lòng thử lại.')
    });
  }

  mauTrangThai(tt: string): string {
    const map: any = { ChoDuyet:'badge-cho', DaXacNhan:'badge-xacnhan', DangAn:'badge-dangphucvu', HoanThanh:'badge-hoan', DaHuy:'badge-huy' };
    return map[tt] || 'badge-cho';
  }

  tenTrangThai(tt: string): string {
    const map: any = { ChoDuyet:'Chờ duyệt', DaXacNhan:'Đã xác nhận', DangAn:'Đang phục vụ', HoanThanh:'Hoàn thành', DaHuy:'Đã hủy' };
    return map[tt] || tt;
  }

  formatGia(g: number): string {
    return (g || 0).toLocaleString('vi-VN') + 'đ';
  }

  dinhDangNgayGio(val: any): string {
    if (!val) return '';
    if (typeof val === 'string' && val.includes('/') && val.includes(':')) {
      return val;
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  tenLoaiBan(loai: string): string {
    const map: any = { VIP: 'Phòng VIP', SanVuon: 'Sân Vườn', NgoaiTroi: 'Ngoài Trời', Thuong: 'Bàn Thường' };
    return map[loai] || loai || 'Bàn Thường';
  }

  tenTrangThaiCoc(tt: string): string {
    const map: any = { DaThanhToan: 'Đã thanh toán', KhongCanCoc: 'Không cần cọc', ChuaThanhToan: 'Chưa thanh toán' };
    return map[tt] || tt || 'Chưa thanh toán';
  }

  // Xuất file Excel (.xlsx) chuẩn OpenXML: Mở trực tiếp trên Microsoft Excel xem được luôn, không cảnh báo, không lỗi font
  xuatExcel() {
    const duLieu = this.dsDonHienThi;
    if (!duLieu || duLieu.length === 0) {
      alert('Không có đơn đặt bàn nào trong danh sách đang chọn để xuất file!');
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
      'Bàn Ăn',
      'Loại Bàn',
      'Thời Gian Đến',
      'Số Lượng Khách',
      'Tiền Cọc (VNĐ)',
      'Trạng Thái Cọc',
      'Trạng Thái Đơn',
      'Ghi Chú'
    ];

    const rows = duLieu.map((don, idx) => [
      idx + 1,
      don.maDatBan || '',
      don.tenBan || ('Bàn #' + don.banAnId),
      this.tenLoaiBan(don.loaiBan),
      don.ngayDen || '',
      don.soNguoi || 1,
      don.tienCoc || 0,
      this.tenTrangThaiCoc(don.trangThaiCoc),
      this.tenTrangThai(don.trangThai),
      don.ghiChu || ''
    ]);

    const aoa = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Căn độ rộng cột rộng rãi để không bị lỗi ###### ở cột thời gian
    ws['!cols'] = [
      { wch: 6 },   // STT
      { wch: 20 },  // Mã Đặt Bàn
      { wch: 28 },  // Bàn Ăn
      { wch: 16 },  // Loại Bàn
      { wch: 22 },  // Thời Gian Đến
      { wch: 16 },  // Số Lượng Khách
      { wch: 18 },  // Tiền Cọc
      { wch: 18 },  // Trạng Thái Cọc
      { wch: 18 },  // Trạng Thái Đơn
      { wch: 32 }   // Ghi Chú
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lịch Sử Đặt Bàn');
    XLSX.writeFile(wb, `LichSuDatBan_${nam}${thang}${ngay}_${gio}${phut}.xlsx`);
  }
}
