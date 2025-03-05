import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/config/AppConfig';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient, private router: Router) {}

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }
  // Thêm vào giỏ hàng
  addToCart(cart: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl('api/v1/cart/add'), cart);
  }

  // Cập nhật số lượng sản phẩm
  updateCart(id: number, cart: any): Observable<any> {
    return this.http.patch<any>(
      this.getFullUrl(`api/v1/cart/update/${id}`),
      cart
    );
  }

  // Xóa một sản phẩm khỏi giỏ hàng
  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(this.getFullUrl(`api/v1/cart/remove/${id}`));
  }

  // Xóa toàn bộ giỏ hàng của user
  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(
      this.getFullUrl(`api/v1/cart/remove/user/${userId}`)
    );
  }

  // Lấy giỏ hàng của người dùng
  getCartItems(userId: number): Observable<any[]> {
    return this.http.get<any[]>(this.getFullUrl(`api/v1/cart/user/${userId}`));
  }
}
