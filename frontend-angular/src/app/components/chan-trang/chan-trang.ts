import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chan-trang',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chan-trang.html',
  styleUrls: ['./chan-trang.css']
})
export class ChanTrangComponent implements OnInit {
  dangMoCua = false;
  thongBaoGio = '';

  ngOnInit() {
    this.kiemTraGioMoCua();
  }

  kiemTraGioMoCua() {
    const now = new Date();
    const gio = now.getHours();
    const phut = now.getMinutes();
    const tongPhut = gio * 60 + phut;

    // Giờ mở cửa: 10:00 (600 phút) đến 22:00 (1320 phút) mỗi ngày
    if (tongPhut >= 600 && tongPhut < 1320) {
      this.dangMoCua = true;
      this.thongBaoGio = '🟢 Đang mở cửa (Đóng 22:00)';
    } else {
      this.dangMoCua = false;
      this.thongBaoGio = '🔴 Đang đóng cửa (Mở lại 10:00)';
    }
  }
}
