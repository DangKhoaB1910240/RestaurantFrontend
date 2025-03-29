import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ItemComponent } from './su-kien/su-kien.component';
import { TrangChuComponent } from './trang-chu/trang-chu.component';
import { DatePipe } from '@angular/common';
import { LichSuComponent } from './lich-su/lich-su.component';
import { TrangChuAdminComponent } from './trang-chu-admin/trang-chu-admin.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { FooterAdminComponent } from './footer-admin/footer-admin.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { PhanQuyenAdminComponent } from './phan-quyen-admin/phan-quyen-admin.component';
import { InfoAdminComponent } from './info-admin/info-admin.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { CategoryAdminComponent } from './nha-to-chuc-admin/nha-to-chuc-admin.component';
import { ItemAdminComponent } from './su-kien-admin/su-kien-admin.component';
import { KhachDatAdminComponent } from './khach-dat-admin/khach-dat-admin.component';
import { CategoryComponent } from './nha-to-chuc/nha-to-chuc.component';
import { BookTableComponent } from './book-table/book-table.component';
import { TableComponent } from './table/table.component';
import { CommentComponent } from './comment/comment.component';
import { CommentAdminComponent } from './comment-admin/comment-admin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    CategoryComponent,
    ItemComponent,
    TrangChuComponent,
    LichSuComponent,
    TrangChuAdminComponent,
    HeaderAdminComponent,
    FooterAdminComponent,
    NavbarAdminComponent,
    PhanQuyenAdminComponent,
    InfoAdminComponent,
    LoginAdminComponent,
    CategoryAdminComponent,
    ItemAdminComponent,
    KhachDatAdminComponent,
    BookTableComponent,
    TableComponent,
    CommentComponent,
    CommentAdminComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
