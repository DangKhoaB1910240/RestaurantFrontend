import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../Services/user/user.service';
import { Event, Router } from '@angular/router';
import { User } from '../Models/user/user';
import { RoleService } from '../Services/role/role.service';
import { Role } from '../Models/role/role';
import { NhaToChucService } from '../Services/nhatochuc/nha-to-chuc.service';
import { NhaToChuc } from '../Models/nhatochuc/nha-to-chuc';
import { SuKienService } from '../Services/sukien/su-kien.service';
import { SuKien } from '../Models/sukien/su-kien';
import { datetimeFormatValidator } from '../validators/datetime-format.validator';
import { TinhThanhService } from '../Services/tinh-thanh/tinh-thanh.service';
import { TinhThanh } from '../Models/tinhThanh/tinh-thanh';
import { TinhThanhChiTiet } from '../Models/tinhThanh/tinh-thanh-chi-tiet';

@Component({
  selector: 'app-su-kien-admin',
  templateUrl: './su-kien-admin.component.html',
  styleUrls: ['./su-kien-admin.component.css']
})
export class SuKienAdminComponent implements OnInit {
  
  isSidebarOpen: boolean = false;
  suKienForm!: FormGroup;
  submitted = false; //Kiểm tra bấm nút submitted chưa
  isCheckSuccess: boolean = false; //Kiểm tra đăng ký thành công không
  successMessage: string = ''; //Thêm thông điệp thành công khi đăng ký
  alreadyExistAccount: string = '';
  errorMessage: string = '';
  listNhaToChuc: NhaToChuc[] = [];
  searchOrganizerName: string = '';

  isEditForm: Boolean = false; //Biến kiểm tra nếu true thì form thêm ngược lại thì form edit
  idSuKien!: number;

  tenSuKien: string = '';
  eventStatus: string = '';
  organizerId: number | string = '';
  listSuKien: SuKien[] = [];

  listTinhThanh: TinhThanh[] = [];
  listQuanHuyen: TinhThanh[] = [];
  listPhuongXa: TinhThanh[] = [];
  chiTiet!: TinhThanhChiTiet;
  constructor(private formBuilder: FormBuilder, private suKienService: SuKienService,private nhaToChucService: NhaToChucService,private router:Router, private tinhThanhService: TinhThanhService) { 
    this.suKienForm = this.formBuilder.group({
        eventName: ['', Validators.required],
        startDateTime: ['', [Validators.required, datetimeFormatValidator()]],
        endDateTime: ['', [Validators.required, datetimeFormatValidator()]],
        description: [''],
        maxQuantity: ['', Validators.required],
        img: ['', Validators.required],
        organizerId: ['', Validators.required],
        tinhThanhId: ['', Validators.required],
        quanHuyenId: ['', Validators.required],
        phuongXaId: ['', Validators.required],
        address: ['', Validators.required],
        cost: ['', Validators.required],
        status: ['']
      });
  }    
  
  ngOnInit(): void {
    this.getNhaToChuc();
    this.getSuKien();
    this.getTinhThanh();
  }
  getSuKien() {
    this.suKienService.getSuKien().subscribe({
      next:(response: SuKien[]) => {
        this.listSuKien = response;

        // Duyệt qua từng sự kiện và tạo fullAddress
        this.listSuKien.forEach(suKien => {
          console.log(suKien.phuongXaId)
          this.tinhThanhService.getDetailsAddressById(suKien.phuongXaId).subscribe({
            next: (c: any) => {
              this.chiTiet = c.data;
              suKien.fullAddress = `${suKien.address}, ${this.chiTiet.full_name}`;
            }
          });
        });
      }
    });
}
  getTinhThanh() {
    this.tinhThanhService.getProvinces().subscribe({
      next: (response: any) => {
        this.listTinhThanh = response.data;
        console.log(this.listTinhThanh);
        console.log(1)
      },
      error: (error) => {

      }
    })
  }
  onTinhThanhChange(event: any) {
    const target = event.target as HTMLSelectElement;
    const tinhThanhId = target.value;
  
    if (tinhThanhId) {
      this.tinhThanhService.getDistricts(tinhThanhId).subscribe({
        next: (response: any) => {
          this.listQuanHuyen = response.data;
          this.listPhuongXa = []; // Clear communes when province changes
          this.suKienForm.controls['quanHuyenId'].setValue('');
          this.suKienForm.controls['phuongXaId'].setValue('');
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      this.listQuanHuyen = [];
      this.listPhuongXa = [];
      this.suKienForm.controls['quanHuyenId'].setValue('');
      this.suKienForm.controls['phuongXaId'].setValue('');
    }
  }
  
  onQuanHuyenChange(event: any) {
    const target = event.target as HTMLSelectElement;
    const quanHuyenId = target.value;
  
    if (quanHuyenId) {
      this.tinhThanhService.getCommunes(quanHuyenId).subscribe({
        next: (response: any) => {
          this.listPhuongXa = response.data;
          this.suKienForm.controls['phuongXaId'].setValue('');
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      this.listPhuongXa = [];
      this.suKienForm.controls['phuongXaId'].setValue('');
    }
  }
  updateSuKienByStatusAndEventNameAndOrganizerId() {
    this.suKienService.getEventsByStatusAndOrganizerIdAndName(this.eventStatus,this.tenSuKien,this.organizerId).subscribe({
      next:(response: SuKien[]) => {
        this.listSuKien = response;
      }
    })
  }

  getNhaToChuc() {
    this.nhaToChucService.getNhaToChuc(this.searchOrganizerName).subscribe({
      next: (response: NhaToChuc[]) => {
        this.listNhaToChuc = response;
      },
      error: (error) => {

      }
    })
  }
  searchOByOrganizerName() {
    this.getNhaToChuc();
  }
  themSuKien() {
    this.submitted = true;
    console.log(this.suKienForm.value);
    if(this.suKienForm.valid == true) {
      this.suKienService.addSuKien(JSON.parse(localStorage.getItem("userId")!),this.suKienForm.value).subscribe({
        next: (response: any) => {
            this.cancel();
            this.isCheckSuccess = true;
            this.successMessage = "Thêm sự kiện thành công";
            this.getSuKien();
        },
        error: (error) => {
        }
      })
    }
  }
  // Chỉnh sửa nhà tổ chức
  suaSuKien() {
    this.submitted = true;
    console.log(this.suKienForm.value)
    this.suKienService.updateById(this.idSuKien,JSON.parse(localStorage.getItem('userId')!),this.suKienForm.value).subscribe({
      next: (response: void) => {
        this.cancel();
        this.isCheckSuccess = true;
        this.successMessage = "Chỉnh sửa sự kiện thành công";
        this.getSuKien();
      },
      error: (error) => {

      }
    })
  }
  // Lấy thông tin nhà tổ chức theo ID
  getInfoById(id: number) {
    this.idSuKien = id;
    this.suKienService.getEventById(id).subscribe({
      next: (response: SuKien) => {
        this.cancel();
        this.isEditForm = true;
        console.log(response);
        this.suKienForm.patchValue({
          eventName: response.eventName,
          startDateTime: response.startDateTime,
          endDateTime: response.endDateTime,
          description: response.description,
          maxQuantity: response.maxQuantity,
          img: response.img,
          organizerId: response.organizer.id,
          tinhThanhId: response.tinhThanhId,
          quanHuyenId: response.quanHuyenId,
          phuongXaId: response.phuongXaId,
          cost: response.cost,
          address: response.address,
          status: response.status
        });
        // Gọi onTinhThanhChange để cập nhật danh sách quận/huyện
        this.onTinhThanhChange({ target: { value: response.tinhThanhId } });

        // Chờ cho danh sách quận/huyện được cập nhật, sau đó gán giá trị quanHuyenId và phuongXaId
        setTimeout(() => {
          this.suKienForm.patchValue({
            quanHuyenId: response.quanHuyenId
          });

          // Gọi onQuanHuyenChange để cập nhật danh sách phường/xã
          this.onQuanHuyenChange({ target: { value: response.quanHuyenId } });

          // Chờ cho danh sách phường/xã được cập nhật, sau đó gán giá trị phuongXaId
          setTimeout(() => {
            this.suKienForm.patchValue({
              phuongXaId: response.phuongXaId
            });
          }, 500);
        }, 500);
        // Cuộn trang lên đầu
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {

      }
    })
  }
  cancel() {
    this.suKienForm.reset();
    this.submitted = false;
    this.isCheckSuccess = false;
    this.alreadyExistAccount = '';
    this.isEditForm = false;
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log(this.isSidebarOpen);
  }
  
  deleteSuKien(id: number) {
    if(confirm('Bạn có chắc chắn muốn xóa sự kiện này')) {
      this.suKienService.deleteById(id,JSON.parse(localStorage.getItem('userId')!)).subscribe({
        next: (response: void) => {
          alert('Xóa sự kiện thành công');
          this.cancel();
          this.getSuKien();
        },
        error: (error) => {
          alert(error.error.message);
        }
      })
    }
  }
}