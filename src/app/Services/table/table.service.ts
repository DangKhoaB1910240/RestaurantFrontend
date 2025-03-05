import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/config/AppConfig';
import { Table } from 'src/app/Models/table/table';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private http: HttpClient, private router: Router) {}

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }

  getAll(): Observable<Table[]> {
    return this.http.get<Table[]>(this.getFullUrl(`api/v1/table/available`));
  }

  // Thêm vào giỏ hàng
  addToTable(table: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl('api/v1/table/add'), table);
  }

  // Cập nhật số lượng sản phẩm
  updateTable(id: number, table: any): Observable<any> {
    return this.http.patch<any>(
      this.getFullUrl(`api/v1/table/update/${id}`),
      table
    );
  }

  // Xóa một sản phẩm khỏi giỏ hàng
  removeFromTable(id: number): Observable<void> {
    return this.http.delete<void>(this.getFullUrl(`api/v1/table/remove/${id}`));
  }

  // Xóa toàn bộ giỏ hàng của user
  clearTable(userId: number): Observable<void> {
    return this.http.delete<void>(
      this.getFullUrl(`api/v1/table/remove/user/${userId}`)
    );
  }
}
