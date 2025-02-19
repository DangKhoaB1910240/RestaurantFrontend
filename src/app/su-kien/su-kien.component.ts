import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ItemService } from '../Services/item/item.service';
import { CategoryService } from '../Services/category/category.service';
import { Category } from '../Models/category/category';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Item } from '../Models/sukien/su-kien';

@Component({
  selector: 'app-su-kien',
  templateUrl: './su-kien.component.html',
  styleUrls: ['./su-kien.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ItemComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService,private ItemService: ItemService,private CategoryService: CategoryService,private router: Router,private route: ActivatedRoute){}
  ngOnInit(): void {
    this.getItem();
    this.getCategory();

    // Lấy giá trị của organizerId từ query parameter
    this.route.queryParams.subscribe(params => {
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
  getCategory() {
    this.spinner.show();
    this.CategoryService.getCategory('').subscribe({
      next: (response: Category[]) => {
        this.spinner.hide();
        this.Category = response;
      }
    })
  }
  getItem() {
    this.spinner.show();
    this.ItemService.getItem().subscribe({
      next:(response: Item[]) => {
        console.log(response)
        this.spinner.hide();
        this.Item = response;
      }
    })
  }
  navigateToItem(id?: number) {
    if(id===undefined) {
      this.organizerId = '';
      this.getItem();
      // Tạo NavigationExtras để xóa query parameter organizerId
      const navigationExtras: NavigationExtras = {
        replaceUrl: true,  // Thay thế URL hiện tại, không tạo lịch sử duyệt web
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
      }
    });
  }
  updateItemByStatus(status: string) {
    this.eventStatus = status;
    this.updateItemByStatusAnditemNameAndOrganizerId();
  }
  updateItemByStatusAnditemNameAndOrganizerId() {
    this.spinner.show();
    this.ItemService.getEventsByStatusAndOrganizerIdAndName(this.eventStatus,this.tenItem,this.organizerId).subscribe({
      next:(response: Item[]) => {
        this.spinner.hide();
        this.Item = response;
        console.log(this.Item);
      }
    })
  }

}
