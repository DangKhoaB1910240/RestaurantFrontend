import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/config/AppConfig';
import { Ghe } from 'src/app/Models/ghe/ghe';

@Injectable({
  providedIn: 'root'
})
export class GheService {

  constructor(private http: HttpClient, private router: Router) { }

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }
  getById(id: number): Observable<Ghe> {
    return this.http.get<Ghe>(
      this.getFullUrl(`api/v1/ghe/${id}`)
    );
  }

  updateById(id: number, giaGhe: number) : Observable<void> {
    return this.http.patch<void>(this.getFullUrl(`api/v1/ghe/${id}`),{giaGhe});
  }
}
