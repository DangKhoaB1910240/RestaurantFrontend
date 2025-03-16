import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Category } from '../Models/category/category';
import { Ghe } from '../Models/ghe/ghe';
import { Item } from '../Models/sukien/su-kien';
import { TinhThanh } from '../Models/tinhThanh/tinh-thanh';
import { TinhThanhChiTiet } from '../Models/tinhThanh/tinh-thanh-chi-tiet';
import { CategoryService } from '../Services/category/category.service';
import { GheService } from '../Services/ghe/ghe.service';
import { TinhThanhService } from '../Services/tinh-thanh/tinh-thanh.service';
import { TableService } from '../Services/table/table.service';
import { Table } from '../Models/table/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  isSidebarOpen: boolean = false;
  TableForm!: FormGroup;
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
  listTable: any[] = [];

  listTinhThanh: TinhThanh[] = [];
  listQuanHuyen: TinhThanh[] = [];
  listPhuongXa: TinhThanh[] = [];
  chiTiet!: TinhThanhChiTiet;
  giaGhe: number = 0;
  constructor(
    private gheService: GheService,
    private formBuilder: FormBuilder,
    private TableService: TableService,
    private CategoryService: CategoryService,
    private router: Router,
    private tinhThanhService: TinhThanhService
  ) {
    this.TableForm = this.formBuilder.group({
      tableNumber: ['', Validators.required],
      capacity: ['', Validators.required],
      price: ['', Validators.required],
      type: ['0'], // Mặc định là bàn thường
      isAvailable: [true], // Mặc định là còn trống
    });
  }

  ngOnInit(): void {
    this.getCategory();
    this.getTable();
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
  getTable() {
    this.TableService.getAllTable().subscribe({
      next: (response: any[]) => {
        this.listTable = response;
      },
    });
  }

  updateItemByStatusAnditemNameAndCategoryId() {
    // this.TableService.getEventsByStatusAndOrganizerIdAndName(
    //   this.eventStatus,
    //   this.tenItem,
    //   this.categoryId
    // ).subscribe({
    //   next: (response: Item[]) => {
    //     this.listTable = response;
    //   },
    // });
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
  themTable() {
    this.submitted = true;
    if (this.TableForm.valid == true) {
      console.log(this.TableForm.value);
      this.TableService.addToTable({
        tableNumber: '23',
        capacity: 2,
        price: 20004000,
        type: '0',
        isAvailable: true,
      }).subscribe({
        next: (response: any) => {
          this.cancel();
          this.isCheckSuccess = true;
          this.successMessage = 'Thêm bàn thành công';
          this.getTable();
        },
        error: (error) => {
          console.log(error.error);
          Swal.fire('Có lỗi xảy ra', error.error.message, 'error');
        },
      });
    }
  }
  // Chỉnh sửa nhà tổ chức
  suaTable() {
    this.submitted = true;
    console.log(this.TableForm.value);
    this.TableService.updateTable(this.idItem, this.TableForm.value).subscribe({
      next: (response: any) => {
        this.cancel();
        this.isCheckSuccess = true;
        this.successMessage = 'Chỉnh sửa bàn thành công';
        this.getTable();
      },
      error: (error) => {},
    });
  }
  getInfoById(id: number) {
    this.idItem = id;
    this.TableService.getById(id).subscribe({
      next: (response: Table) => {
        this.cancel();
        this.isEditForm = true;
        console.log(response);
        this.TableForm.patchValue({
          tableNumber: response.tableNumber,
          capacity: response.capacity,
          price: response.price,
          type: response.type,
          isAvailable: response.isAvailable,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {},
    });
  }
  cancel() {
    this.TableForm.reset();
    this.submitted = false;
    this.isCheckSuccess = false;
    this.alreadyExistAccount = '';
    this.isEditForm = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log(this.isSidebarOpen);
  }

  deleteTable(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa bàn này')) {
      this.TableService.removeFromTable(id).subscribe({
        next: (response: void) => {
          alert('Xóa bàn thành công');
          this.cancel();
          this.getTable();
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
    }
  }
}
