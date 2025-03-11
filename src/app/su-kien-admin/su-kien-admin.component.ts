import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../Services/user/user.service';
import { Event, Router } from '@angular/router';
import { User } from '../Models/user/user';
import { RoleService } from '../Services/role/role.service';
import { Role } from '../Models/role/role';
import { CategoryService } from '../Services/category/category.service';
import { Category } from '../Models/category/category';
import { ItemService } from '../Services/item/item.service';
import { datetimeFormatValidator } from '../validators/datetime-format.validator';
import { TinhThanhService } from '../Services/tinh-thanh/tinh-thanh.service';
import { TinhThanh } from '../Models/tinhThanh/tinh-thanh';
import { TinhThanhChiTiet } from '../Models/tinhThanh/tinh-thanh-chi-tiet';
import { GheService } from '../Services/ghe/ghe.service';
import { Ghe } from '../Models/ghe/ghe';
import { Item } from '../Models/sukien/su-kien';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-su-kien-admin',
  templateUrl: './su-kien-admin.component.html',
  styleUrls: ['./su-kien-admin.component.css'],
})
export class ItemAdminComponent implements OnInit {
  isSidebarOpen: boolean = false;
  ItemForm!: FormGroup;
  submitted = false; //Kiểm tra bấm nút submitted chưa
  isCheckSuccess: boolean = false; //Kiểm tra đăng ký thành công không
  successMessage: string = ''; //Thêm thông điệp thành công khi đăng ký
  alreadyExistAccount: string = '';
  errorMessage: string = '';
  listCategory: Category[] = [];
  searchname: string = '';

  isEditForm: Boolean = false; //Biến kiểm tra nếu true thì form thêm ngược lại thì form edit
  idItem!: number;

  tenItem: string = '';
  eventStatus: string = '';
  categoryId: number | string = '';
  listItem: Item[] = [];

  listTinhThanh: TinhThanh[] = [];
  listQuanHuyen: TinhThanh[] = [];
  listPhuongXa: TinhThanh[] = [];
  chiTiet!: TinhThanhChiTiet;
  giaGhe: number = 0;
  constructor(
    private gheService: GheService,
    private formBuilder: FormBuilder,
    private ItemService: ItemService,
    private CategoryService: CategoryService,
    private router: Router,
    private tinhThanhService: TinhThanhService
  ) {
    this.ItemForm = this.formBuilder.group({
      itemName: ['', Validators.required],
      description: [''],
      img: ['', Validators.required],
      categoryId: ['', Validators.required],
      cost: ['', Validators.required],
      status: [''],
      bestSeller: [false], // Mặc định là false
      yeuThichNhat: [false], // Mặc định là false
      monMoiNhat: [false], // Mặc định là false
      monChay: [false], // Mặc định là false
    });
  }

  ngOnInit(): void {
    this.getCategory();
    this.getItem();
    this.getGheById();
  }
  getGheById() {
    this.gheService.getById(1).subscribe({
      next: (response: Ghe) => {
        this.giaGhe = response.giaGhe;
      },
      error: (error) => {},
    });
  }
  updateGia(id: number) {
    this.gheService.updateById(id, this.giaGhe).subscribe({
      next: (response: void) => {
        alert('Cập nhật giá ghế vip thành công');
      },
      error: (error) => {
        alert(error.error.message);
      },
    });
  }
  getItem() {
    this.ItemService.getItem().subscribe({
      next: (response: Item[]) => {
        this.listItem = response;
      },
    });
  }

  updateItemByStatusAnditemNameAndCategoryId() {
    this.ItemService.getEventsByStatusAndOrganizerIdAndName(
      this.eventStatus,
      this.tenItem,
      this.categoryId
    ).subscribe({
      next: (response: Item[]) => {
        this.listItem = response;
      },
    });
  }

  getCategory() {
    this.CategoryService.getCategory(this.searchname).subscribe({
      next: (response: Category[]) => {
        this.listCategory = response;
      },
      error: (error) => {},
    });
  }
  searchOByname() {
    this.getCategory();
  }
  themItem() {
    this.submitted = true;
    console.log(this.ItemForm.value);
    if (this.ItemForm.valid == true) {
      this.ItemService.addItem(
        JSON.parse(localStorage.getItem('userId')!),
        this.ItemForm.value
      ).subscribe({
        next: (response: any) => {
          this.cancel();
          this.isCheckSuccess = true;
          this.successMessage = 'Thêm món ăn thành công';
          this.getItem();
        },
        error: (error) => {
          Swal.fire('Có lỗi xảy ra', error.error.message, 'error');
        },
      });
    }
  }
  // Chỉnh sửa nhà tổ chức
  suaItem() {
    this.submitted = true;
    console.log(this.ItemForm.value);
    this.ItemService.updateById(
      this.idItem,
      JSON.parse(localStorage.getItem('userId')!),
      this.ItemForm.value
    ).subscribe({
      next: (response: void) => {
        this.cancel();
        this.isCheckSuccess = true;
        this.successMessage = 'Chỉnh sửa món ăn thành công';
        this.getItem();
      },
      error: (error) => {},
    });
  }
  getInfoById(id: number) {
    this.idItem = id;
    this.ItemService.getEventById(id).subscribe({
      next: (response: Item) => {
        this.cancel();
        this.isEditForm = true;
        console.log(response);
        this.ItemForm.patchValue({
          itemName: response.itemName,
          description: response.description,
          cost: response.cost,
          img: response.img,
          categoryId: response.category.id,
          bestSeller: response.bestSeller,
          yeuThichNhat: response.yeuThichNhat,
          monMoiNhat: response.monMoiNhat,
          monChay: response.monChay,
          status: response.status,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {},
    });
  }
  cancel() {
    this.ItemForm.reset();
    this.submitted = false;
    this.isCheckSuccess = false;
    this.alreadyExistAccount = '';
    this.isEditForm = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log(this.isSidebarOpen);
  }

  deleteItem(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa món ăn này')) {
      this.ItemService.deleteById(
        id,
        JSON.parse(localStorage.getItem('userId')!)
      ).subscribe({
        next: (response: void) => {
          alert('Xóa món ăn thành công');
          this.cancel();
          this.getItem();
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
    }
  }
}
