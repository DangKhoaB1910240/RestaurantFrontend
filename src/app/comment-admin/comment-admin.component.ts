import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommentService } from '../Services/comment/comment.service';

@Component({
  selector: 'app-comment-admin',
  templateUrl: './comment-admin.component.html',
  styleUrls: ['./comment-admin.component.css'],
})
export class CommentAdminComponent {
  isSidebarOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log(this.isSidebarOpen);
  }
  reviews: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.spinner.show();
    this.commentService.getAllComment().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  deleteComment(reviewId: number) {
    if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
      this.spinner.show();
      this.commentService.delete(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(
            (review) => review.id !== reviewId
          );
          this.spinner.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.spinner.hide();
        },
      });
    }
  }
}
