import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-thanh-dieu-huong',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './thanh-dieu-huong.html',
  styleUrls: ['./thanh-dieu-huong.css']
})
export class ThanhDieuHuongComponent {
  hienMenu = false;
  hienMenuUser = false;

  constructor(public auth: AuthService, private router: Router) {}

  get nguoiDung() { return this.auth.layNguoiDung(); }

  dangXuat() {
    this.auth.dangXuat();
    this.hienMenuUser = false;
    this.router.navigate(['/dang-nhap']);
  }
}
