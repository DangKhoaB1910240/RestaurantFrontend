import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/Models/category/category';
import { AppConfig } from 'src/app/config/AppConfig';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private router: Router) { }

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }
  getCategory(name: string | null): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.getFullUrl(`api/v1/category?name=${name}`)
    );
  }
  addCategory(userId: number,ntc: Category) : Observable<any> {
    return this.http.post<void>(this.getFullUrl(`api/v1/category/user/${userId}`),ntc);
  }
  deleteCategory(id: number, userId: number | string) : Observable<any> {
    return this.http.delete<void>(this.getFullUrl(`api/v1/category/${id}/user/${userId}`));
  }
  getInfoById(id: number): Observable<Category> {
    return this.http.get<Category>(this.getFullUrl(`api/v1/category/${id}`));
  }
  updateById(id: number,userId: number, Category: Category) : Observable<void> {
    return this.http.patch<void>(this.getFullUrl(`api/v1/category/${id}/user/${userId}`),Category);
  }
}
