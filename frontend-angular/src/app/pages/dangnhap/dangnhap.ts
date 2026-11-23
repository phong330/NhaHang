import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-dangnhap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dangnhap.html',
  styleUrls: ['./dangnhap.css']
})
export class DangnhapComponent {
  dangMoDangKy = false;
  daBamDangNhap = false;
  daBamDangKy = false;
  formDangNhap: FormGroup;
  formDangKy: FormGroup;

  constructor(private fb: FormBuilder, public auth: AuthService, private router: Router) {
    this.formDangNhap = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      matKhau: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.formDangKy = this.fb.group({
      hoTen: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      soDienThoai: [''],
      matKhau: ['', [Validators.required, Validators.minLength(6)]]
    });

    setTimeout(() => this.khoiTaoGoogle(), 500);
  }

  khoiTaoGoogle() {
    try {
      if (typeof google === 'undefined') return;
      const el = document.getElementById('google-btn');
      if (!el) return;
      google.accounts.id.initialize({
        client_id: '596669911736-08pl881v6paa1cnb3pu65k2unav8s05h.apps.googleusercontent.com',
        callback: (res: any) => {
          if (!res.credential) return;
          this.auth.dangNhapGoogle(res.credential).subscribe({
            next: (r: any) => this.xuLyDangNhapThanhCong(r.user),
            error: () => alert('Đăng nhập Google thất bại!')
          });
        }
      });
      google.accounts.id.renderButton(el, { theme:'outline', size:'large', text:'signin_with', shape:'pill' });
    } catch {}
  }

  xuLyDangNhapThanhCong(user: any) {
    this.auth.luuDangNhap(user);
    const vaiTro = user.vaiTro;
    if (vaiTro === 'Admin' || vaiTro === 'QuanLy') {
      this.router.navigate(['/admin']);
    } else if (vaiTro === 'Staff' || vaiTro === 'NhanVien') {
      this.router.navigate(['/staff']);
    } else {
      this.router.navigate(['/']);
    }
  }

  dangNhap() {
    this.daBamDangNhap = true;
    if (this.formDangNhap.invalid) {
      this.formDangNhap.markAllAsTouched();
      return;
    }
    this.auth.dangNhap(this.formDangNhap.value).subscribe({
      next: (r: any) => this.xuLyDangNhapThanhCong(r.user),
      error: (err: any) => alert(err.error?.message || 'Email hoặc mật khẩu không đúng!')
    });
  }

  dangKy() {
    this.daBamDangKy = true;
    if (this.formDangKy.invalid) {
      this.formDangKy.markAllAsTouched();
      return;
    }
    this.auth.dangKy(this.formDangKy.value).subscribe({
      next: () => { 
        alert('Đăng ký thành công! Vui lòng đăng nhập.'); 
        this.dangMoDangKy = false; 
        this.daBamDangKy = false;
        this.formDangKy.reset(); 
      },
      error: (err: any) => alert(err.error?.message || 'Email đã tồn tại!')
    });
  }
}
