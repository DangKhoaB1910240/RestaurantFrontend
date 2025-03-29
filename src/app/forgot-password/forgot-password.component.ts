import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) return;
    this.spinner.show();
    this.authService
      .forgotPassword(this.forgotPasswordForm.value.email)
      .subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.message =
            'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.';
        },
        error: (err) => {
          this.spinner.hide();
          console.log(err);
          this.message = 'Không thể gửi email. Vui lòng thử lại.';
        },
      });
  }
}
