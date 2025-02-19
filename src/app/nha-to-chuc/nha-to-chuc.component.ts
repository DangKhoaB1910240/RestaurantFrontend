import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Category } from '../Models/category/category';
import { CategoryService } from '../Services/category/category.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nha-to-chuc',
  templateUrl: './nha-to-chuc.component.html',
  styleUrls: ['./nha-to-chuc.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {
  Category: Category[] = [];
  constructor(private CategoryService: CategoryService,private router: Router){}
  ngOnInit(): void {
      this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            // Scroll lên đầu trang khi route thay đổi
            window.scrollTo(0, 0);
          }
        });
      this.getCategory();
  }
  getCategory() {
    this.CategoryService.getCategory('').subscribe({
      next:(response: Category[]) => {
        this.Category = response;
      }
    })
  }
  navigateToItem(id: number) {
    this.router.navigate(['/Item'], { queryParams: { organizerId: id } });
  } 
}
