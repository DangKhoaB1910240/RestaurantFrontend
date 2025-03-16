import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { TrangChuComponent } from './trang-chu/trang-chu.component';
import { LoginComponent } from './login/login.component';
import { ItemComponent } from './su-kien/su-kien.component';
import { LichSuComponent } from './lich-su/lich-su.component';
import { TrangChuAdminComponent } from './trang-chu-admin/trang-chu-admin.component';
import { PhanQuyenAdminComponent } from './phan-quyen-admin/phan-quyen-admin.component';
import { InfoAdminComponent } from './info-admin/info-admin.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { ItemAdminComponent } from './su-kien-admin/su-kien-admin.component';
import { KhachDatAdminComponent } from './khach-dat-admin/khach-dat-admin.component';
import { CategoryAdminComponent } from './nha-to-chuc-admin/nha-to-chuc-admin.component';
import { CategoryComponent } from './nha-to-chuc/nha-to-chuc.component';
import { BookTableComponent } from './book-table/book-table.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  { path: '', redirectTo: '/trangchu', pathMatch: 'full' },
  { path: 'trangchu', component: TrangChuComponent },
  { path: 'dangnhap', component: LoginComponent },
  { path: 'Category', component: CategoryComponent },
  { path: 'Item', component: ItemComponent },
  { path: 'lichsu', component: LichSuComponent },
  { path: 'trangchu-admin', component: TrangChuAdminComponent },
  { path: 'phanquyen-admin', component: PhanQuyenAdminComponent },
  { path: 'info-admin', component: InfoAdminComponent },
  { path: 'dangnhap-admin', component: LoginAdminComponent },
  { path: 'ban-admin', component: TableComponent },
  { path: 'nha-to-chuc-admin', component: CategoryAdminComponent },
  { path: 'su-kien-admin', component: ItemAdminComponent },
  { path: 'datve', component: KhachDatAdminComponent },
  { path: 'dat-ban', component: BookTableComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
