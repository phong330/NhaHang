import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { staffGuard } from './guards/staff.guard';
import { dangNhapGuard } from './guards/dangnhap.guard';
import { TrangchuComponent } from './pages/trangchu/trangchu';
import { ThucDonComponent } from './pages/thuc-don/thuc-don';
import { DatBanComponent } from './pages/dat-ban/dat-ban';
import { LichSuDatBanComponent } from './pages/lich-su-dat-ban/lich-su-dat-ban';
import { DangnhapComponent } from './pages/dangnhap/dangnhap';

export const routes: Routes = [
  { path: '', component: TrangchuComponent },
  { path: 'thuc-don', component: ThucDonComponent },
  { path: 'dat-ban', component: DatBanComponent, canActivate: [dangNhapGuard] },
  { path: 'lich-su-dat-ban', component: LichSuDatBanComponent, canActivate: [dangNhapGuard] },
  { path: 'dang-nhap', component: DangnhapComponent },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent)
  },
  {
    path: 'staff',
    canActivate: [staffGuard],
    loadComponent: () => import('./pages/staff/staff').then(m => m.StaffComponent)
  },
  {
    path: 'thanh-toan-ket-qua',
    loadComponent: () => import('./pages/thanh-toan-ket-qua/thanh-toan-ket-qua').then(m => m.ThanhToanKetQuaComponent)
  },
  { path: '**', redirectTo: '' }
];
