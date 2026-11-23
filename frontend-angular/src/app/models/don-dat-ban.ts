export interface DonDatBan {
  id: number;
  maDatBan: string;
  taiKhoanId: number;
  banAnId: number;
  ngayDat: string;
  ngayDen: string;
  soNguoi: number;
  ghiChu: string;
  trangThai: string;
  tienCoc: number;
  trangThaiCoc: string;
  tenBan?: string;
  loaiBan?: string;
}
