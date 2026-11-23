import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const staffGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.daDangNhap()) {
    alert('Vui lòng đăng nhập!');
    router.navigate(['/dang-nhap']);
    return false;
  }
  if (!auth.laStaff()) {
    alert('Bạn không có quyền truy cập trang nghiệp vụ nhân viên!');
    router.navigate(['/']);
    return false;
  }
  return true;
};
