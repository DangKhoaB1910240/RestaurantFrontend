import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Models/user/user';
import { UserService } from '../Services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      fullname: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  submitted = false; //Kiểm tra bấm nút submitted chưa
  isCheckSuccess: boolean = false; //Kiểm tra đăng ký thành công không
  successMessage: string = ''; //Thêm thông điệp thành công khi đăng ký
  alreadyExistAccount: string = '';
  errorMessage: string = '';
  submitDangNhap = false;
  ngOnInit(): void {
    // Khai báo các biến
    let login: HTMLElement | null,
      closex: HTMLElement | null,
      cancelbtn: HTMLElement | null,
      containerx: HTMLElement | null;

    // Lấy giá trị các phần tử
    containerx = document.querySelector('.containerx');
    login = document.querySelector('.login');
    closex = document.getElementById('closex');
    cancelbtn = document.querySelector('.cancelbtn');

    // Gán hành động mở modal khi click lên nút login
    if (login) {
      login.onclick = function () {
        if (containerx) {
          containerx.style.display = 'block';
        }
      };
    }

    // Gán hành động đóng modal khi click lên nút closex
    if (closex) {
      closex.onclick = function () {
        if (containerx) {
          containerx.style.display = 'none';
        }
      };
    }

    // Gán hành động đóng modal khi click lên nút cancel
    if (cancelbtn) {
      cancelbtn.onclick = function () {
        if (containerx) {
          containerx.style.display = 'none';
        }
      };
    }

    // Gán hành động đóng modal khi click bên ngoài form đăng nhập
    window.onclick = function (e) {
      if (e.target === containerx) {
        if (containerx) {
          containerx.style.display = 'none';
        }
      }
    };
  }
  dangKy() {
    this.submitted = true;
    if (
      this.registerForm.valid == true &&
      this.registerForm.value.password ==
        this.registerForm.value.confirmPassword
    ) {
      this.userService.taoTaiKhoan(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.cancel();
          this.isCheckSuccess = true;
          this.successMessage = response.message;
        },
        error: (error) => {
          this.alreadyExistAccount = error.error.message;
        },
      });
    }
  }
  dangNhap() {
    this.submitDangNhap = true;
    if (this.loginForm.valid == true) {
      this.userService.dangNhap(this.loginForm.value).subscribe({
        next: (response: any) => {
          response.roles.forEach((element: string) => {
            if (element == 'USER') {
              localStorage.setItem('token', response.token);
              localStorage.setItem('role', element);
              localStorage.setItem(
                'username',
                JSON.stringify(this.loginForm.value.username)
              );
              this.router.navigate(['/trangchu']);
              this.submitDangNhap = false;
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'Đăng nhập thất bại!';
        },
      });
    }
  }
  cancel() {
    this.registerForm.reset();
    this.submitted = false;
    this.isCheckSuccess = false;
    this.alreadyExistAccount = '';
  }
}
