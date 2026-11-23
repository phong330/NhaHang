import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thanh-toan-ket-qua',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './thanh-toan-ket-qua.html',
  styleUrls: ['./thanh-toan-ket-qua.css']
})
export class ThanhToanKetQuaComponent {
  maDatBan = '';
  thanhCong = false;
  maLoi = '';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(p => {
      this.maDatBan = p['maDatBan'] || '';
      this.thanhCong = p['trangThai'] === 'success';
      this.maLoi = p['maLoi'] || '';
    });
  }
}
