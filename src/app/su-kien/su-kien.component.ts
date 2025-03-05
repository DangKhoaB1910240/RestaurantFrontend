import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ItemService } from '../Services/item/item.service';
import { CategoryService } from '../Services/category/category.service';
import { Category } from '../Models/category/category';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Item } from '../Models/sukien/su-kien';
import { CartService } from '../Services/cart/cart.service';
import { UserService } from '../Services/user/user.service';
import { User } from '../Models/user/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-su-kien',
  templateUrl: './su-kien.component.html',
  styleUrls: ['./su-kien.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ItemComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private ItemService: ItemService,
    private CategoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.getItem();
    this.getCategory();
    this.checkExistByUserId();

    // Lấy giá trị của organizerId từ query parameter
    this.route.queryParams.subscribe((params) => {
      const organizerId = params['organizerId'];

      if (organizerId) {
        this.organizerId = organizerId;
        // Gọi API hoặc xử lý theo organizerId
        // this.updateItemByOrganizerId(organizerId);
        this.updateItemByStatusAnditemNameAndOrganizerId();
      }
    });
  }
  soLuong: number = 0;
  Item: Item[] = [];
  Category: Category[] = [];
  tenItem: string = '';
  eventStatus: string = '';
  organizerId: number | string = '';
  userId!: number;
  user!: User;
  cartItems: any[] = [];
  getCategory() {
    this.spinner.show();
    this.CategoryService.getCategory('').subscribe({
      next: (response: Category[]) => {
        this.spinner.hide();
        this.Category = response;
      },
    });
  }
  getItem() {
    this.spinner.show();
    this.ItemService.getItem().subscribe({
      next: (response: Item[]) => {
        console.log(response);
        this.spinner.hide();
        this.Item = response;
      },
    });
  }
  navigateToItem(id?: number) {
    if (id === undefined) {
      this.organizerId = '';
      this.getItem();
      // Tạo NavigationExtras để xóa query parameter organizerId
      const navigationExtras: NavigationExtras = {
        replaceUrl: true, // Thay thế URL hiện tại, không tạo lịch sử duyệt web
      };

      this.router.navigate(['/Item'], navigationExtras);
    } else {
      this.router.navigate(['/Item'], { queryParams: { organizerId: id } });
    }
  }
  updateItemByOrganizerId(organizerId: number) {
    this.ItemService.getItemByOrganizerId(organizerId).subscribe({
      next: (response: Item[]) => {
        this.spinner.hide();
        this.Item = response;
      },
      error: (error) => {
        // Xử lý lỗi nếu cần
      },
    });
  }
  updateItemByStatus(status: string) {
    this.eventStatus = status;
    this.updateItemByStatusAnditemNameAndOrganizerId();
  }
  updateItemByStatusAnditemNameAndOrganizerId() {
    this.spinner.show();
    this.ItemService.getEventsByStatusAndOrganizerIdAndName(
      this.eventStatus,
      this.tenItem,
      this.organizerId
    ).subscribe({
      next: (response: Item[]) => {
        this.spinner.hide();
        this.Item = response;
        console.log(this.Item);
      },
    });
  }

  checkExistByUserId() {
    const username = localStorage.getItem('username');
    this.userService.getInfoByUsername(JSON.parse(username!)).subscribe({
      next: (response: User) => {
        this.userId = response.id;
        this.user = response;
        // this.updateItemByStatusAnditemNameAndOrganizerId();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadCart() {
    this.cartService.getCartItems(this.userId).subscribe((data) => {
      this.cartItems = data;
    });
  }

  // Thêm vào giỏ hàng
  addToCart(item: any) {
    const data = {
      item_id: item.id,
      user_id: 1,
      quantity: 1,
      totalPrice: item.cost,
    };
    this.cartService.addToCart(data).subscribe({
      next: (response: void) => {
        this.loadCart(); // Cập nhật giỏ hàng sau khi thêm
        Swal.fire('Chúc mừng', 'Bạn đã thêm món ăn thành công', 'success');
      },
      error: (error) => {},
    });
  }

  // Lấy số lượng của sản phẩm trong giỏ
  getCartQuantity(itemId: number): number {
    const cartItem = this.cartItems.find((c) => c.itemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  }

  // Thêm số lượng sản phẩm
  increaseQuantity(item: any) {
    this.cartService
      .updateCart(item.id, this.getCartQuantity(item.id) + 1)
      .subscribe(() => this.loadCart());
  }

  // Giảm số lượng sản phẩm
  decreaseQuantity(item: any) {
    const currentQty = this.getCartQuantity(item.id);
    if (currentQty > 1) {
      this.cartService
        .updateCart(item.id, currentQty - 1)
        .subscribe(() => this.loadCart());
    } else {
      this.cartService.removeFromCart(item.id).subscribe(() => this.loadCart());
    }
  }
}
