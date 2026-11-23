import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.daDangNhap()) {
    alert('Vui lòng đăng nhập!');
    router.navigate(['/dang-nhap']);
    return false;
  }
  if (!auth.laAdmin()) {
    if (auth.laStaffOnly()) {
      router.navigate(['/staff']);
    } else {
      alert('Bạn không có quyền truy cập trang quản trị!');
      router.navigate(['/']);
    }
    return false;
  }
  return true;
};
