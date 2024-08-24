import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TinhThanh } from 'src/app/Models/tinhThanh/tinh-thanh';
import { TinhThanhChiTiet } from 'src/app/Models/tinhThanh/tinh-thanh-chi-tiet';

@Injectable({
  providedIn: 'root'
})
export class TinhThanhService {

  private apiUrl = 'https://esgoo.net/api-tinhthanh/'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Get all provinces
  getProvinces(): Observable<TinhThanh[]> {
    return this.http.get<TinhThanh[]>(`${this.apiUrl}/1/0.htm`);
  }

  // Get districts by province ID
  getDistricts(provinceId: string): Observable<TinhThanh[]> {
    return this.http.get<TinhThanh[]>(`${this.apiUrl}/2/${provinceId}.htm`);
  }

  // Get communes by district ID
  getCommunes(districtId: string): Observable<TinhThanh[]> {
    return this.http.get<TinhThanh[]>(`${this.apiUrl}/3/${districtId}.htm`);
  }

  getDetailsAddressById(communesId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/5/${communesId}.htm`);
  }
  
}