import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../Services/user/user.service';
import { User } from '../Models/user/user';
import { CommentService } from '../Services/comment/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentComponent {
  userId = 1;
  reviews: any[] = [];
  commentForm: FormGroup;
  currentUsername: string = '';
  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private userService: UserService,
    private commentService: CommentService
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }
  ngOnInit(): void {
    this.checkExistByUserId();

    this.loadUserInfo();
    this.loadComments();
  }
  checkExistByUserId() {
    const username = localStorage.getItem('username');
    this.userService.getInfoByUsername(JSON.parse(username!)).subscribe({
      next: (response: User) => {
        this.userId = response.id;
        console.log(this.userId);
        // this.updateItemByStatusAnditemNameAndOrganizerId();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadUserInfo() {
    const username = localStorage.getItem('username');
    if (username) {
      this.userService.getInfoByUsername(JSON.parse(username)).subscribe({
        next: (response) => {
          this.userId = response.id;
          this.currentUsername = response.username;
        },
        error: (error) => console.log(error),
      });
    }
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

  onSubmit() {
    if (this.commentForm.valid) {
      const reviewData = {
        userId: this.userId,
        content: this.commentForm.get('content')?.value,
        rating: this.commentForm.get('rating')?.value,
      };

      this.spinner.show();
      this.commentService.addComment(reviewData).subscribe({
        next: (newReview) => {
          this.reviews.unshift(newReview);
          this.commentForm.reset({ rating: 5 });
          this.spinner.hide();
        },
        error: (error) => {
          console.log(error);
          this.spinner.hide();
        },
      });
    }
  }

  deleteComment(reviewId: number, userId: number) {
    if (userId !== this.userId) {
      alert('Bạn chỉ có thể xóa bình luận của chính mình!');
      return;
    }

    if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
      this.spinner.show();
      this.commentService.delete(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(
            (review) => review.id !== reviewId
          );
          this.spinner.hide();
        },
        error: (error) => {
          console.log(error);
          this.spinner.hide();
        },
      });
    }
  }
}
