import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonAn } from '../models/mon-an';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MonanService {
  private api = 'http://localhost:5000/api/MonAn';
  constructor(private http: HttpClient, private auth: AuthService) {}

  layTatCa(danhMuc?: string): Observable<MonAn[]> {
    const url = danhMuc && danhMuc !== 'TatCa' ? `${this.api}?danhMuc=${danhMuc}` : this.api;
    return this.http.get<MonAn[]>(url);
  }

  layNoiBat(): Observable<MonAn[]> { return this.http.get<MonAn[]>(`${this.api}/noi-bat`); }
  layTheoId(id: number): Observable<MonAn> { return this.http.get<MonAn>(`${this.api}/${id}`); }
  themMon(dto: any): Observable<any> { return this.http.post(this.api, dto, { headers: this.auth.layHeaders() }); }
  suaMon(id: number, dto: any): Observable<any> { return this.http.put(`${this.api}/${id}`, dto, { headers: this.auth.layHeaders() }); }
  xoaMon(id: number): Observable<any> { return this.http.delete(`${this.api}/${id}`, { headers: this.auth.layHeaders() }); }
}
