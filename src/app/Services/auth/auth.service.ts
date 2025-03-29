import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../config/AppConfig';
import { Observable, catchError, tap } from 'rxjs';
import { Auth } from '../../Models/auth/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(this.getFullUrl('api/v1/auth/forgot-password'), {
      email,
    });
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post<any>(
      this.getFullUrl('api/v1/auth/reset-password'),
      data
    );
  }

  //Lấy role
  getRoles(username: string): Observable<string[]> {
    return this.http.get<string[]>(
      this.getFullUrl(`api/v1/user/role/${username}`)
    );
  }

  //set user
  setUsername(username: string): void {
    localStorage.setItem('username', JSON.stringify(username));
  }

  //get user
  getUsername(): string {
    const userString = localStorage.getItem('username');
    return userString != null ? JSON.parse(userString) : null;
  }

  //đăng xuất
  logout(): any {
    if (this.getUsername() != null) {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  }

  //đăng nhập
  login(auth: Auth): void {
    this.http
      .post(this.getFullUrl('api/v1/user/login'), auth)
      .pipe(
        tap((response: any) => {
          console.log(response);
          if (response.accessToken) {
            //Lưu trữ user nếu cần dùng
            this.setUsername(auth.getUsername());
            // lưu trữ token
            localStorage.setItem('accessToken', response.accessToken);
            //Kiểm duyệt vai trò
            this.getRoles(auth.getUsername()).subscribe((roles) => {
              if (roles.includes('STUDENT')) {
                this.router.navigate(['/home']);
              } else {
                this.router.navigate(['/admin']);
              }
            });
          }
        }),
        catchError((error) => {
          Swal.fire(
            'Đăng nhập thất bại',
            'Vui lòng kiểm tra lại tài khoản và mật khẩu',
            'error'
          );
          throw error;
        })
      )
      .subscribe();
  }
}
