import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BanService } from '../../services/ban.service';
import { MonanService } from '../../services/monan.service';
import { DatbanService } from '../../services/datban.service';
import { ThanhtoanService } from '../../services/thanhtoan.service';
import { AuthService } from '../../services/auth.service';
import { BanAn } from '../../models/ban-an';
import { MonAn } from '../../models/mon-an';

@Component({
  selector: 'app-dat-ban',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dat-ban.html',
  styleUrls: ['./dat-ban.css']
})
export class DatBanComponent {
  buoc = 1; // 1: Thong tin | 2: Chon ban | 3: Chon mon | 4: Xac nhan

  formThongTin: FormGroup;
  dsBanTrong: BanAn[] = [];
  banDaChon: BanAn | null = null;
  dsMonAn: MonAn[] = [];
  monDaChon: { mon: MonAn; soLuong: number }[] = [];
  phuongThucThanhToan = 'taiquan'; // 'taiquan' | 'qr'

  // Bộ lọc bàn theo khu vực
  khuVucLoc = 'TatCa';
  cacKhuVuc = [
    { key: 'TatCa', ten: '🏛️ Tất cả khu vực' },
    { key: 'KhuA', ten: '🏛️ Khu vực A' },
    { key: 'KhuB', ten: '🌿 Khu vực B' },
    { key: 'VIP', ten: '👑 Khu VIP' }
  ];

  // Bộ lọc món đặt trước (6 danh mục)
  danhMucMonDat = 'TatCa';
  tuKhoaMonDat = '';
  cacDanhMucMon = [
    { key: 'TatCa', ten: 'Tất cả' },
    { key: 'KhaiVi', ten: 'Khai vị' },
    { key: 'MonChinh', ten: 'Món chính' },
    { key: 'HaiSan', ten: 'Hải sản' },
    { key: 'MonChay', ten: 'Món chay' },
    { key: 'DoUong', ten: 'Đồ uống' },
    { key: 'TrangMieng', ten: 'Tráng miệng' }
  ];

  dangTai = false;
  thongBaoLoi = '';

  // QR payment info
  thongTinQR: any = null;
  hienQR = false;

  // Danh sach khung gio phuc vu thuc te (Nha hang mo cua 10:00 - 22:00, luot nhan cuoi 20:30)
  dsKhungGio = [
    { gio: '10:00', label: '10:00 (Ca trưa)' },
    { gio: '10:30', label: '10:30 (Ca trưa)' },
    { gio: '11:00', label: '11:00 (Ca trưa)' },
    { gio: '11:30', label: '11:30 (Ca trưa)' },
    { gio: '12:00', label: '12:00 (Ca trưa)' },
    { gio: '12:30', label: '12:30 (Ca trưa)' },
    { gio: '13:00', label: '13:00 (Ca trưa)' },
    { gio: '13:30', label: '13:30 (Ca trưa)' },
    { gio: '17:00', label: '17:00 (Ca tối)' },
    { gio: '17:30', label: '17:30 (Ca tối)' },
    { gio: '18:00', label: '18:00 (Ca tối)' },
    { gio: '18:30', label: '18:30 (Ca tối)' },
    { gio: '19:00', label: '19:00 (Ca tối)' },
    { gio: '19:30', label: '19:30 (Ca tối)' },
    { gio: '20:00', label: '20:00 (Ca tối)' },
    { gio: '20:30', label: '20:30 (Ca tối - Đặt bàn cuối)' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private banService: BanService,
    private monanService: MonanService,
    private datbanService: DatbanService,
    private thanhtoanService: ThanhtoanService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    const homNay = this.ngayHienTai();
    const d = new Date();
    const phutHienTai = d.getHours() * 60 + d.getMinutes();
    const daHetGioHomNay = phutHienTai >= 1230; // 20:30

    const ngayKhoiTao = daHetGioHomNay ? this.ngayMai() : homNay;
    const gioKhoiTao = daHetGioHomNay ? '11:30' : this.layGioGoiYHopLe();

    this.formThongTin = this.fb.group({
      ngayDen: [ngayKhoiTao, [Validators.required, this.kiemTraNgayKhongQuaKhu()]],
      gioDen: [gioKhoiTao, Validators.required],
      soNguoi: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      ghiChu: ['']
    });

    // Tu dong dieu chinh gio neu chuyen ngay
    this.formThongTin.get('ngayDen')?.valueChanges.subscribe(ngay => {
      if (ngay === this.ngayHienTai() && this.hetGioHomNay()) {
        this.thongBaoLoi = '⚠️ Hôm nay nhà hàng đã qua 20:30 (hết giờ nhận bàn). Bạn vui lòng chọn ngày mai trở đi nhé!';
      } else {
        if (this.thongBaoLoi.includes('hết giờ nhận bàn')) this.thongBaoLoi = '';
        const gioChon = this.formThongTin.get('gioDen')?.value;
        if (this.laGioDaQua(gioChon)) {
          this.formThongTin.patchValue({ gioDen: this.layGioGoiYHopLe() }, { emitEvent: false });
        }
      }
      this.cdr.detectChanges();
    });

    // Nhan query params tu trang chu (neu co)
    this.route.queryParams.subscribe(p => {
      if (p['ngay']) {
        const ngayParam = p['ngay'];
        this.formThongTin.patchValue({ ngayDen: ngayParam >= homNay ? ngayParam : homNay });
      }
      if (p['gio']) this.formThongTin.patchValue({ gioDen: p['gio'] });
      if (p['soNguoi']) this.formThongTin.patchValue({ soNguoi: +p['soNguoi'] });
    });

    // Tai mon an
    this.monanService.layTatCa().subscribe({
      next: ds => {
        this.dsMonAn = Array.isArray(ds) ? ds.filter(m => m.conHang) : [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  // Validator ngan chan chon ngay qua khu
  kiemTraNgayKhongQuaKhu() {
    return (control: any) => {
      if (!control.value) return null;
      const homNay = this.ngayHienTai();
      return control.value < homNay ? { ngayQuaKhu: true } : null;
    };
  }

  // Kiem tra gio da qua so voi gio hien tai
  laGioDaQua(gioStr: string): boolean {
    const ngayChon = this.formThongTin?.get('ngayDen')?.value;
    if (!ngayChon) return false;
    const homNay = this.ngayHienTai();
    if (ngayChon > homNay) return false;
    if (ngayChon < homNay) return true;

    const [gio, phut] = (gioStr || '00:00').split(':').map(Number);
    const now = new Date();
    const phutChon = gio * 60 + phut;
    const phutHienTai = now.getHours() * 60 + now.getMinutes();
    return phutChon <= (phutHienTai + 15);
  }

  // Kiem tra xem ngay hom nay da het luot dat ban chua (sau 20:30)
  hetGioHomNay(): boolean {
    const ngayChon = this.formThongTin?.get('ngayDen')?.value;
    if (!ngayChon) return false;
    if (ngayChon !== this.ngayHienTai()) return false;
    const now = new Date();
    return (now.getHours() * 60 + now.getMinutes()) >= 1230;
  }

  layGioGoiYHopLe(): string {
    const slot = this.dsKhungGio.find(k => !this.laGioDaQua(k.gio));
    return slot ? slot.gio : '18:00';
  }

  // BUOC 1: Tim ban trong
  timBanTrong() {
    this.thongBaoLoi = '';
    if (this.formThongTin.invalid) {
      this.formThongTin.markAllAsTouched();
      if (this.formThongTin.get('ngayDen')?.hasError('ngayQuaKhu')) {
        this.thongBaoLoi = '⚠️ Không được chọn ngày trong quá khứ! Vui lòng chọn ngày từ hôm nay trở đi.';
      }
      this.cdr.detectChanges();
      return;
    }

    const { ngayDen, gioDen, soNguoi } = this.formThongTin.value;
    const homNay = this.ngayHienTai();

    if (ngayDen < homNay) {
      this.thongBaoLoi = '⚠️ Không được chọn ngày trong quá khứ! Vui lòng chọn ngày từ hôm nay trở đi.';
      this.cdr.detectChanges();
      return;
    }

    if (this.hetGioHomNay() && ngayDen === homNay) {
      this.thongBaoLoi = '⚠️ Hôm nay đã qua 20:30 (hết giờ nhận đặt bàn). Bạn vui lòng chọn ngày mai trở đi nhé!';
      this.cdr.detectChanges();
      return;
    }

    if (this.laGioDaQua(gioDen)) {
      this.thongBaoLoi = '⚠️ Khung giờ đã chọn đã trôi qua! Vui lòng chọn khung giờ khác hoặc ngày tiếp theo.';
      this.cdr.detectChanges();
      return;
    }

    const ngayGio = `${ngayDen}T${gioDen}:00`;
    this.dangTai = true;
    this.banService.layBanTrong(ngayGio, soNguoi).subscribe({
      next: ds => {
        this.dsBanTrong = ds;
        this.buoc = 2;
        this.dangTai = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.thongBaoLoi = err.error?.thongBao || 'Không tải được danh sách bàn!';
        this.dangTai = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Getter lọc bàn theo khu vực
  get dsBanTrongHienThi(): BanAn[] {
    if (this.khuVucLoc === 'TatCa') return this.dsBanTrong;
    return this.dsBanTrong.filter(b => b.loai === this.khuVucLoc);
  }

  // BUOC 2: Chon ban
  chonBan(ban: BanAn) {
    this.banDaChon = ban;
    this.buoc = 3;
  }

  // Getter lọc món đặt trước
  get dsMonDatHienThi(): MonAn[] {
    let list = this.dsMonAn;
    if (this.danhMucMonDat !== 'TatCa') {
      list = list.filter(m => m.danhMuc === this.danhMucMonDat);
    }
    if (this.tuKhoaMonDat.trim()) {
      const kw = this.tuKhoaMonDat.toLowerCase().trim();
      list = list.filter(m =>
        (m.tenMon && m.tenMon.toLowerCase().includes(kw)) ||
        (m.moTa && m.moTa.toLowerCase().includes(kw))
      );
    }
    return list;
  }

  // BUOC 3: Quan ly mon dat truoc
  soLuongMon(mon: MonAn): number {
    return this.monDaChon.find(x => x.mon.id === mon.id)?.soLuong ?? 0;
  }

  tangMon(mon: MonAn) {
    const item = this.monDaChon.find(x => x.mon.id === mon.id);
    if (item) item.soLuong++;
    else this.monDaChon.push({ mon, soLuong: 1 });
  }

  giamMon(mon: MonAn) {
    const idx = this.monDaChon.findIndex(x => x.mon.id === mon.id);
    if (idx < 0) return;
    if (this.monDaChon[idx].soLuong <= 1) this.monDaChon.splice(idx, 1);
    else this.monDaChon[idx].soLuong--;
  }

  tongTienMon(): number {
    return this.monDaChon.reduce((t, x) => t + x.mon.gia * x.soLuong, 0);
  }

  tienCoc(): number {
    return this.banDaChon ? this.banDaChon.tienCoc : 0;
  }

  // BUOC 4: Xac nhan va dat ban
  xacNhanDatBan() {
    const nguoiDung = this.auth.layNguoiDung();
    if (!nguoiDung) { alert('Vui lòng đăng nhập!'); return; }

    const { ngayDen, gioDen, ghiChu } = this.formThongTin.value;
    const soNguoi = this.formThongTin.value.soNguoi;
    const ngayGio = `${ngayDen}T${gioDen}:00`;

    const dto = {
      taiKhoanId: nguoiDung.id,
      banAnId: this.banDaChon!.id,
      ngayDen: ngayGio,
      soNguoi: soNguoi,
      ghiChu: ghiChu || '',
      tienCoc: this.phuongThucThanhToan === 'taiquan' ? 0 : this.tienCoc(),
      danhSachMon: this.monDaChon.map(x => ({ monAnId: x.mon.id, soLuong: x.soLuong, donGia: x.mon.gia }))
    };

    this.dangTai = true;
    this.datbanService.taoDon(dto).subscribe({
      next: (res) => {
        this.dangTai = false;
        if (this.phuongThucThanhToan === 'qr') {
          this.thanhtoanService.taoMaQR(res.maDatBan, this.tienCoc()).subscribe({
            next: r => { this.thongTinQR = r; this.hienQR = true; },
            error: () => {
              alert(`✅ Đặt bàn thành công!\nMã đặt bàn: ${res.maDatBan}\nNhân viên sẽ liên hệ xác nhận.`);
              this.router.navigate(['/lich-su-dat-ban']);
            }
          });
        } else {
          alert(`✅ Đặt bàn thành công!\nMã đặt bàn: ${res.maDatBan}\nNhà hàng đã ghi nhận đơn đặt bàn. Nhân viên sẽ liên hệ xác nhận trong thời gian sớm nhất.`);
          this.router.navigate(['/lich-su-dat-ban']);
        }
      },
      error: (err) => { this.dangTai = false; alert(err.error?.thongBao || 'Đặt bàn thất bại!'); }
    });
  }

  quayLai() {
    if (this.buoc > 1) this.buoc--;
  }

  formatGia(gia: number): string { return (gia || 0).toLocaleString('vi-VN') + 'đ'; }
  ngayHienTai(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  ngayMai(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  tenDanhMuc(dm: string): string {
    const m: any = {
      KhaiVi: 'Khai vị',
      MonChinh: 'Món chính',
      HaiSan: 'Hải sản',
      MonChay: 'Món chay',
      TrangMieng: 'Tráng miệng',
      DoUong: 'Đồ uống'
    };
    return m[dm] || dm;
  }
  tenKhuVuc(loai: string): string {
    const m: any = {
      KhuA: '🏛️ Khu vực A',
      KhuB: '🌿 Khu vực B',
      VIP: '👑 Khu VIP',
      Thuong: '🏛️ Khu A (Thường)',
      SanVuon: '🌿 Khu B (Sân vườn)',
      NgoaiTroi: '⛅ Khu B (Ngoài trời)'
    };
    return m[loai] || loai;
  }
}
