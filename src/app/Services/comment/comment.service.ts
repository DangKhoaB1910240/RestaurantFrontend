import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/config/AppConfig';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient, private router: Router) {}

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }
  getAllComment(): Observable<any[]> {
    return this.http.get<any[]>(this.getFullUrl(`api/v1/review`));
  }
  addComment(data: any): Observable<any> {
    return this.http.post<void>(this.getFullUrl(`api/v1/review`), data);
  }
  delete(id: number): Observable<any> {
    return this.http.delete<void>(this.getFullUrl(`api/v1/review/${id}`));
  }
}
