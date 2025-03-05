import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoryService } from '../Services/category/category.service';
import { Category } from '../Models/category/category';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../Models/user/user';
import { UserService } from '../Services/user/user.service';
import { RegisterService } from '../Models/register-service/register-service';
import { RegistrationService } from '../Services/registration/registration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../Models/sukien/su-kien';
import { ReservationService } from '../Services/reservation/reservation.service';
@Component({
  selector: 'app-lich-su',
  templateUrl: './lich-su.component.html',
  styleUrls: ['./lich-su.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LichSuComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private registrationService: RegistrationService,
    private CategoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService
  ) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  reservations: any[] = [];
  ngOnInit(): void {
    this.checkExistByUserId();
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
    console.log(login);
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
  changePasswordForm!: FormGroup;
  soLuong: number = 0;
  Item: Item[] = [];
  Category: Category[] = [];
  tenItem: string = '';
  eventStatus: string = '';
  organizerId: number | string = '';
  userId!: number;
  user!: User;
  submitted = false; //Kiểm tra bấm nút submitted chưa
  isCheckSuccess: boolean = false; //Kiểm tra đăng ký thành công không
  successMessage: string = ''; //Thêm thông điệp thành công khi đăng ký
  errorMessage: string = '';
  changePassword() {
    this.submitted = true;
    const username = localStorage.getItem('username');
    console.log(this.changePasswordForm.value);
    if (
      this.changePasswordForm.valid &&
      this.changePasswordForm.value.newPassword ==
        this.changePasswordForm.value.confirmPassword
    ) {
      this.userService
        .doiMatKhau(this.changePasswordForm.value, JSON.parse(username!))
        .subscribe({
          next: (response: any) => {
            this.cancel();
            this.isCheckSuccess = true;
            this.successMessage = 'Đổi mật khẩu thành công';
          },
          error: (error) => {
            this.errorMessage = error.error.message;
          },
        });
    }
  }
  cancel() {
    this.changePasswordForm.reset();
    this.submitted = false;
    this.isCheckSuccess = false;
    this.errorMessage = '';
  }

  loadLichSu() {
    this.reservationService.getLichSu(this.userId).subscribe({
      next: (response: any) => {
        this.reservations = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getStatus(status: number): string {
    const statusMap = ['Chưa xử lý', 'Đã cọc', 'Đã nhận bàn', 'Đã hủy bỏ'];
    return statusMap[status] || 'Không xác định';
  }

  navigateToItem(id?: number) {
    if (id === undefined) {
      this.organizerId = '';
      this.updateItemByStatusAnditemNameAndOrganizerId();
      // Tạo NavigationExtras để xóa query parameter organizerId
      const navigationExtras: NavigationExtras = {
        replaceUrl: true, // Thay thế URL hiện tại, không tạo lịch sử duyệt web
      };

      this.router.navigate(['/Item'], navigationExtras);
    } else {
      this.router.navigate(['/Item'], { queryParams: { organizerId: id } });
    }
  }
  checkExistByUserId() {
    const username = localStorage.getItem('username');
    this.userService.getInfoByUsername(JSON.parse(username!)).subscribe({
      next: (response: User) => {
        this.userId = response.id;
        this.user = response;
        this.loadLichSu();
        // this.updateItemByStatusAnditemNameAndOrganizerId();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  updateItemByStatus(status: string) {
    this.eventStatus = status;
    this.updateItemByStatusAnditemNameAndOrganizerId();
  }
  updateItemByStatusAnditemNameAndOrganizerId() {
    console.log(this.userId);
    this.spinner.show();
    // this.registrationService.getEventsByUserIdAndStatusAndOrganizerIdAndName(this.userId,this.eventStatus,this.tenItem,this.organizerId).subscribe({
    //   next:(response: Item[]) => {
    //     this.spinner.hide();
    //     this.Item = response;
    //     console.log(this.Item);
    //   }
    // })
  }
}
