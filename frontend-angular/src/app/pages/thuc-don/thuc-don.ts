import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MonanService } from '../../services/monan.service';
import { MonAn } from '../../models/mon-an';

@Component({
  selector: 'app-thuc-don',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './thuc-don.html',
  styleUrls: ['./thuc-don.css']
})
export class ThucDonComponent implements OnInit {
  danhMucChon = 'TatCa';
  dsMonAn: MonAn[] = [];
  dangTai = true;
  tuKhoaTimKiem = '';
  sapXepGia: '' | 'tang' | 'giam' = '';

  cacDanhMuc = [
    { key: 'TatCa', ten: '🍽️ Tất cả' },
    { key: 'KhaiVi', ten: '🥗 Khai vị' },
    { key: 'MonChinh', ten: '🍖 Món chính' },
    { key: 'HaiSan', ten: '🦐 Hải sản' },
    { key: 'MonChay', ten: '🥬 Món chay' },
    { key: 'DoUong', ten: '🥤 Đồ uống' },
    { key: 'TrangMieng', ten: '🍮 Tráng miệng' }
  ];

  constructor(
    private monanService: MonanService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.taiMon();
  }

  taiMon() {
    this.dangTai = true;
    this.cdr.markForCheck();
    this.monanService.layTatCa(this.danhMucChon).subscribe({
      next: ds => {
        this.dsMonAn = Array.isArray(ds) ? ds : [];
        this.dangTai = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Lỗi khi tải thực đơn:', err);
        this.dangTai = false;
        this.cdr.detectChanges();
      }
    });
  }

  chonDanhMuc(dm: string) {
    this.danhMucChon = dm;
    this.taiMon();
  }

  get dsMonHienThi(): MonAn[] {
    let ketQua = [...this.dsMonAn];

    // Lọc theo từ khóa tìm kiếm
    if (this.tuKhoaTimKiem.trim()) {
      const kw = this.tuKhoaTimKiem.toLowerCase().trim();
      ketQua = ketQua.filter(m =>
        (m.tenMon && m.tenMon.toLowerCase().includes(kw)) ||
        (m.moTa && m.moTa.toLowerCase().includes(kw))
      );
    }

    // Sắp xếp theo giá
    if (this.sapXepGia === 'tang') {
      ketQua.sort((a, b) => (a.gia || 0) - (b.gia || 0));
    } else if (this.sapXepGia === 'giam') {
      ketQua.sort((a, b) => (b.gia || 0) - (a.gia || 0));
    }

    return ketQua;
  }

  xoaTimKiem() {
    this.tuKhoaTimKiem = '';
  }

  datBanVoiMon(mon: MonAn) {
    this.router.navigate(['/dat-ban']);
  }

  formatGia(gia: number): string {
    return (gia || 0).toLocaleString('vi-VN') + 'đ';
  }

  tenDanhMuc(dm: string): string {
    const map: any = {
      KhaiVi: 'Khai vị',
      MonChinh: 'Món chính',
      HaiSan: 'Hải sản',
      MonChay: 'Món chay',
      TrangMieng: 'Tráng miệng',
      DoUong: 'Đồ uống'
    };
    return map[dm] || dm;
  }
}
