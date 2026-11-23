import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MonanService } from '../../services/monan.service';
import { MonAn } from '../../models/mon-an';

@Component({
  selector: 'app-trangchu',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './trangchu.html',
  styleUrls: ['./trangchu.css']
})
export class TrangchuComponent implements OnInit {
  dsMonNoiBat: MonAn[] = [];
  ngayDatNhanh = '';
  gioDatNhanh = '18:00';
  soNguoiNhanh = 2;

  constructor(
    private monanService: MonanService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taiMonNoiBat();
    this.khoiTaoNgayGio();
  }

  khoiTaoNgayGio() {
    const d = new Date();
    const phutHienTai = d.getHours() * 60 + d.getMinutes();
    // 20:30 = 1230 phút (Hết giờ nhận bàn hôm nay)
    if (phutHienTai >= 1230) {
      this.ngayDatNhanh = this.ngayMai();
      this.gioDatNhanh = '11:30';
    } else {
      this.ngayDatNhanh = this.ngayHienTai();
      this.gioDatNhanh = phutHienTai < 780 ? '11:30' : '18:00';
    }
  }

  taiMonNoiBat() {
    this.monanService.layNoiBat().subscribe({
      next: ds => {
        this.dsMonNoiBat = Array.isArray(ds) ? ds.slice(0, 6) : [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  datBanNhanh() {
    if (!this.ngayDatNhanh || this.ngayDatNhanh < this.ngayHienTai()) {
      this.ngayDatNhanh = this.ngayHienTai();
    }
    this.router.navigate(['/dat-ban'], {
      queryParams: { ngay: this.ngayDatNhanh, gio: this.gioDatNhanh, soNguoi: this.soNguoiNhanh }
    });
  }

  formatGia(gia: number): string {
    return (gia || 0).toLocaleString('vi-VN') + 'đ';
  }

  ngayHienTai(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  ngayMai(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
