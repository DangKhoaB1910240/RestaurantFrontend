import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../Services/logger/logger.service';
import { Logger } from '../Models/logger/logger';
import { CategoryService } from '../Services/category/category.service';
import { ItemService } from '../Services/item/item.service';
import { Category } from '../Models/category/category';
import { Item } from '../Models/sukien/su-kien';

@Component({
  selector: 'app-trang-chu-admin',
  templateUrl: './trang-chu-admin.component.html',
  styleUrls: ['./trang-chu-admin.component.css']
})
export class TrangChuAdminComponent implements OnInit{
  isSidebarOpen: boolean = false; 
  loggers: Logger[] = [];
  listCategory: Category[] = [];
  listItem: Item[] = [];
  constructor(
    private loggerService: LoggerService,
    private CategoryService: CategoryService,
    private ItemService: ItemService
  ) { }
  ngOnInit(): void {
    this.getAllLoggers();
    this.getAllCategory();
    this.getAllItem();
  }
  getAllLoggers() {
    this.loggerService.getAllLoggers().subscribe({
      next: (responses: Logger[]) => {
        console.log(responses);
        this.loggers = responses;
      },
      error: (error) => {
        
      }
    })
  }
  getAllCategory() {
    this.CategoryService.getCategory('').subscribe({
      next: (response : Category[]) => {
        this.listCategory = response;
      },
      error: (error) => {

      }
    })
  }
  getAllItem() {
    this.ItemService.getItem().subscribe({
      next: (response : Item[]) => {
        this.listItem = response;
      },
      error: (error) => {

      }
    })
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log(this.isSidebarOpen);
  }
}
