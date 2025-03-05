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

@Component({
  selector: 'app-nha-to-chuc-admin',
  templateUrl: './nha-to-chuc-admin.component.html',
  styleUrls: ['./nha-to-chuc-admin.component.css'],
})
export class CategoryAdminComponent implements OnInit {
  isSidebarOpen: boolean = false;
  CategoryForm!: FormGroup;
  submitted = false; //Kiểm tra bấm nút submitted chưa
  isCheckSuccess: boolean = false; //Kiểm tra đăng ký thành công không
  successMessage: string = ''; //Thêm thông điệp thành công khi đăng ký
  alreadyExistAccount: string = '';
  errorMessage: string = '';
  listCategory: Category[] = [];
  searchname: string = '';

  isEditForm: Boolean = false; //Biến kiểm tra nếu true thì form thêm ngược lại thì form edit
  idCategory!: number;
  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private router: Router
  ) {
    this.CategoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      img: ['', Validators.required],
      // address: ['', Validators.required],
      // phone: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    this.getCategory();
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
  themCategory() {
    this.submitted = true;
    console.log(this.CategoryForm.value);
    if (this.CategoryForm.valid == true) {
      this.CategoryService.addCategory(
        JSON.parse(localStorage.getItem('userId')!),
        this.CategoryForm.value
      ).subscribe({
        next: (response: any) => {
          this.cancel();
          this.isCheckSuccess = true;
          this.successMessage = 'Thêm danh mục món ăn thành công';
          this.getCategory();
        },
        error: (error) => {},
      });
    }
  }
  // Chỉnh sửa danh mục món ăn
  suaCategory() {
    this.submitted = true;
    this.CategoryService.updateById(
      this.idCategory,
      JSON.parse(localStorage.getItem('userId')!),
      this.CategoryForm.value
    ).subscribe({
      next: (response: void) => {
        this.cancel();
        this.isCheckSuccess = true;
        this.successMessage = 'Chỉnh sửa danh mục món ăn thành công';
        this.getCategory();
      },
      error: (error) => {},
    });
  }
  // Lấy thông tin danh mục món ăn theo ID
  getInfoById(id: number) {
    this.idCategory = id;
    this.CategoryService.getInfoById(id).subscribe({
      next: (response: Category) => {
        this.isEditForm = true;
        this.CategoryForm.patchValue({
          name: response.name,
          img: response.img,
        });
        // Cuộn trang lên đầu
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {},
    });
  }
  cancel() {
    this.CategoryForm.reset();
    this.submitted = false;
    this.isCheckSuccess = false;
    this.alreadyExistAccount = '';
    this.isEditForm = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log(this.isSidebarOpen);
  }

  deleteCategory(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục món ăn này')) {
      this.CategoryService.deleteCategory(
        id,
        JSON.parse(localStorage.getItem('userId')!)
      ).subscribe({
        next: (response: void) => {
          alert('Xóa danh mục món ăn thành công');
          this.cancel();
          this.getCategory();
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
    }
  }
}
