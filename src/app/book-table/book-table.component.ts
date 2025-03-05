import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from '../Models/table/table';
import { ReservationService } from '../Services/reservation/reservation.service';
import { TableService } from '../Services/table/table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Item } from '../Models/sukien/su-kien';
import { ItemService } from '../Services/item/item.service';
import { CartService } from '../Services/cart/cart.service';
import { UserService } from '../Services/user/user.service';
import { User } from '../Models/user/user';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BookTableComponent implements OnInit {
  reservationForm: FormGroup;
  tables: Table[] = [];
  minDateTime: string = '';
  cartItems: any[] = [];
  userId = 1; // ID người dùng (có thể lấy từ AuthService)

  constructor(
    private spinner: NgxSpinnerService,
    private ItemService: ItemService,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private tableService: TableService,
    private cartService: CartService,
    private userService: UserService
  ) {
    this.reservationForm = this.fb.group({
      tableId: ['', Validators.required],
      reservationTime: ['', Validators.required],
      depositFee: ['200000', [Validators.required, Validators.min(0)]],
      orderType: ['1', Validators.required],
    });
  }
  Item: Item[] = [];

  ngOnInit(): void {
    this.loadCart();
    this.loadTables();
    this.setMinDateTime();
    this.checkExistByUserId();
  }
  checkExistByUserId() {
    const username = localStorage.getItem('username');
    this.userService.getInfoByUsername(JSON.parse(username!)).subscribe({
      next: (response: User) => {
        this.userId = response.id;
        // this.updateItemByStatusAnditemNameAndOrganizerId();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setMinDateTime(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Chuyển về UTC để tránh lệch múi giờ
    this.minDateTime = now.toISOString().slice(0, 16); // Định dạng YYYY-MM-DDTHH:MM
  }

  loadTables(): void {
    this.tableService.getAll().subscribe((tables) => {
      this.tables = tables;
    });
  }

  onTableChange(event: Event): void {
    const tableId = (event.target as HTMLSelectElement).value; // Lấy giá trị từ select
    const selectedTable = this.tables.find((t) => t.id === +tableId);

    if (selectedTable) {
      this.reservationForm.patchValue({
        tableId: selectedTable.id,
        depositFee: selectedTable.price ? selectedTable.price + 200000 : 200000,
        orderType: '0', // Khi có tableId thì đổi thành "Ăn tại chỗ"
      });
    } else {
      this.reservationForm.patchValue({
        orderType: '1', // Khi không có bàn thì quay về "Mang đi"
        depositFee: 200000,
      });
    }
  }

  submitForm(): void {
    // if (this.reservationForm.valid) {
    //   const reservationData = this.reservationForm.getRawValue();
    //   this.reservationService.createReservation(reservationData).subscribe(response => {
    //     alert('Đặt bàn thành công!');
    //     this.reservationForm.reset();
    //   }, error => {
    //     alert('Có lỗi xảy ra!');
    //   });
    // }
  }

  loadCart() {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        this.cartItems = response;
        console.log(response);
      },
      error: () => {},
    });
  }

  increaseQuantity(cartItem: any) {
    const updatedQuantity = cartItem.quantity + 1;
    this.updateCart(cartItem.id, updatedQuantity);
  }

  decreaseQuantity(cartItem: any) {
    if (cartItem.quantity > 1) {
      const updatedQuantity = cartItem.quantity - 1;
      this.updateCart(cartItem.id, updatedQuantity);
    } else {
      this.removeFromCart(cartItem.id);
    }
  }

  updateCart(cartId: number, quantity: number) {
    this.cartService.updateCart(cartId, { quantity }).subscribe({
      next: (response: any) => {
        this.loadCart();
      },
    });
  }

  removeFromCart(cartId: number) {
    this.cartService.removeFromCart(cartId).subscribe({
      next: (response: any) => {
        this.loadCart();
      },
    });
  }
}
