import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../Services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  loginForm!: FormGroup;
  submitDangNhap = false;
  errorMessage: string = '';
  dangNhap() {
    this.submitDangNhap = true;
    if (this.loginForm.valid == true) {
      this.userService.dangNhap(this.loginForm.value).subscribe({
        next: (response: any) => {
          response.roles.forEach((element: string) => {
            if (element != 'USER') {
              localStorage.setItem('tokenAdmin', response.token);
              localStorage.setItem('role', element);
              localStorage.setItem(
                'usernameAdmin',
                JSON.stringify(this.loginForm.value.username)
              );
              this.router.navigate(['/trangchu-admin']);
              this.submitDangNhap = false;
            } else {
              this.errorMessage = 'Đăng nhập thất bại!';
            }
          });
        },
        error: (error) => {
          console.log(error);
          if (error.error.httpStatusCode == 401) {
            console.log(1);
            this.errorMessage = 'Đăng nhập thất bại!';
          } else {
            this.errorMessage = error.error.message;
          }
        },
      });
    }
  }
}
