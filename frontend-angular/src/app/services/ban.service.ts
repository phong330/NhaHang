import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BanAn } from '../models/ban-an';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BanService {
  private api = 'http://localhost:5000/api/BanAn';
  constructor(private http: HttpClient, private auth: AuthService) {}

  layTatCa(): Observable<BanAn[]> {
    return this.http.get<BanAn[]>(this.api);
  }

  layBanTrong(ngayDen: string, soNguoi: number): Observable<BanAn[]> {
    return this.http.get<BanAn[]>(`${this.api}/trong?ngayDen=${ngayDen}&soNguoi=${soNguoi}`);
  }

  layTheoId(id: number): Observable<BanAn> {
    return this.http.get<BanAn>(`${this.api}/${id}`);
  }

  themBan(dto: any): Observable<any> { return this.http.post(this.api, dto, { headers: this.auth.layHeaders() }); }
  suaBan(id: number, dto: any): Observable<any> { return this.http.put(`${this.api}/${id}`, dto, { headers: this.auth.layHeaders() }); }
  doiTrangThai(id: number, trangThai: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/trang-thai`, { trangThai }, { headers: this.auth.layHeaders() });
  }
  xoaBan(id: number): Observable<any> { return this.http.delete(`${this.api}/${id}`, { headers: this.auth.layHeaders() }); }
}
