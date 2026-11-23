import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThanhtoanService {
  private api = 'http://localhost:5000/api/ThanhToan';
  constructor(private http: HttpClient) {}

  taoVnPay(maDatBan: string, soTien: number): Observable<any> {
    return this.http.post<any>(`${this.api}/tao-thanh-toan-vnpay`, { maDatBan, soTien });
  }

  taoMaQR(maDatBan: string, soTien: number): Observable<any> {
    return this.http.post<any>(`${this.api}/tao-ma-qr`, { maDatBan, soTien });
  }
}
