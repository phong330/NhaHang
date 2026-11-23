import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DatbanService {
  private api = 'http://localhost:5000/api/DonDatBan';
  constructor(private http: HttpClient, private auth: AuthService) {}

  layTatCa(ngay?: string): Observable<any[]> {
    const url = ngay ? `${this.api}?ngay=${ngay}` : this.api;
    return this.http.get<any[]>(url, { headers: this.auth.layHeaders() });
  }

  layTheoTaiKhoan(taiKhoanId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/tai-khoan/${taiKhoanId}`, { headers: this.auth.layHeaders() });
  }

  layChiTiet(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}/chi-tiet`, { headers: this.auth.layHeaders() });
  }

  taoDon(dto: any): Observable<any> { return this.http.post(this.api, dto, { headers: this.auth.layHeaders() }); }

  capNhatTrangThai(id: number, trangThai: string, trangThaiCoc?: string): Observable<any> {
    return this.http.put(`${this.api}/${id}/trang-thai`, { trangThai, trangThaiCoc }, { headers: this.auth.layHeaders() });
  }

  layThongKe(): Observable<any> { return this.http.get(`${this.api}/thong-ke`, { headers: this.auth.layHeaders() }); }
  layDoanhThuThang(): Observable<any[]> { return this.http.get<any[]>(`${this.api}/doanh-thu-thang`, { headers: this.auth.layHeaders() }); }
}
