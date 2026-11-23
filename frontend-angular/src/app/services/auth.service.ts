import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api/TaiKhoan';
  private KEY = 'nguoiDungNhaHang';

  constructor(private http: HttpClient) {}

  dangKy(dto: any): Observable<any> {
    return this.http.post<any>(`${this.api}/dang-ky`, dto);
  }

  dangNhap(dto: any): Observable<any> {
    return this.http.post<any>(`${this.api}/dang-nhap`, dto);
  }

  dangNhapGoogle(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.api}/dang-nhap-google`, { idToken });
  }

  luuDangNhap(user: any) {
    localStorage.setItem(this.KEY, JSON.stringify(user));
  }

  layNguoiDung(): any {
    const d = localStorage.getItem(this.KEY);
    return d ? JSON.parse(d) : null;
  }

  daDangNhap(): boolean {
    return this.layNguoiDung() !== null;
  }

  dangXuat() {
    localStorage.removeItem(this.KEY);
  }

  laAdmin(): boolean {
    const u = this.layNguoiDung();
    return u ? ['Admin', 'QuanLy'].includes(u.vaiTro) : false;
  }

  laQuanLy(): boolean {
    return this.laAdmin();
  }

  laStaff(): boolean {
    const u = this.layNguoiDung();
    return u ? ['Staff', 'NhanVien', 'Admin', 'QuanLy'].includes(u.vaiTro) : false;
  }

  laStaffOnly(): boolean {
    const u = this.layNguoiDung();
    return u ? ['Staff', 'NhanVien'].includes(u.vaiTro) : false;
  }

  laNhanVien(): boolean {
    return this.laStaff();
  }

  laCustomer(): boolean {
    const u = this.layNguoiDung();
    return u ? ['Customer', 'KhachHang'].includes(u.vaiTro) : false;
  }

  layHeaders(): { [key: string]: string } {
    const user = this.layNguoiDung();
    if (!user) return {};
    return {
      'X-User-Id': String(user.id),
      'X-User-Role': user.vaiTro || ''
    };
  }

  // Quản lý tài khoản (Admin)
  layTatCaTaiKhoan(): Observable<any[]> {
    return this.http.get<any[]>(this.api, { headers: this.layHeaders() });
  }

  taoTaiKhoan(dto: any): Observable<any> {
    return this.http.post<any>(this.api, dto, { headers: this.layHeaders() });
  }

  capNhatTaiKhoan(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, dto, { headers: this.layHeaders() });
  }

  doiTrangThaiTaiKhoan(id: number, trangThai: string): Observable<any> {
    return this.http.patch<any>(`${this.api}/${id}/trang-thai`, { trangThai }, { headers: this.layHeaders() });
  }

  capNhatThongTinCaNhan(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/thong-tin`, dto, { headers: this.layHeaders() });
  }
}
