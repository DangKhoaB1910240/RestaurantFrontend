import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../Services/auth/auth.service';
import { Auth } from '../../Models/auth/auth';
@Component({
  selector: 'app-login-student',
  templateUrl: './login-student.component.html',
  styleUrls: ['./login-student.component.css'],
})
export class LoginStudentComponent {
  form: any;
  constructor(fb: FormBuilder, private authService: AuthService) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    console.log(123);
    this.authService.login(
      new Auth(this.form.value.username, this.form.value.password)
    );
  }
}
