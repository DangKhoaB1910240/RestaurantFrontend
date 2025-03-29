import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    this.submitted = true;
    if (
      this.resetPasswordForm.invalid ||
      this.resetPasswordForm.errors?.['mismatch']
    ) {
      return;
    }
    const newPassword = this.resetPasswordForm.value.password;

    this.spinner.show();
    this.authService
      .resetPassword({ token: this.token, newPassword })
      .subscribe({
        next: (response: any) => {
          this.spinner.hide();
          alert('Mật khẩu đã được đặt lại thành công!');
          const userRole = response?.role || localStorage.getItem('userRole');

          if (userRole === 'admin') {
            this.router.navigate(['/dangnhap-admin']);
          } else {
            this.router.navigate(['/dangnhap']);
          }
        },
        error: (error) => {
          this.spinner.hide();
          alert('Token đã hết hạn');
        },
      });
  }
}
