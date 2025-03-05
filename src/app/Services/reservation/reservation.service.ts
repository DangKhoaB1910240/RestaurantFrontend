import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/config/AppConfig';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient, private router: Router) {}

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }

  bookTable(reservation: any): Observable<string> {
    return this.http.post(
      this.getFullUrl(`api/v1/reservation/add`),
      reservation,
      { responseType: 'text' }
    );
  }

  getLichSu(userId: number): Observable<any> {
    return this.http.get(this.getFullUrl(`api/v1/reservation/user/${userId}`));
  }
}
