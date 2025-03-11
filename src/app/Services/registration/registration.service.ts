import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Registration } from 'src/app/Models/registration/registration';
import { Item } from 'src/app/Models/sukien/su-kien';
import { AppConfig } from 'src/app/config/AppConfig';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient, private router: Router) {}

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }
  registerEvent(registration: any): Observable<string> {
    return this.http.post(
      this.getFullUrl(`api/v1/registration`),
      registration,
      { responseType: 'text' }
    );
  }
  checkExist(userId: number, eventId: number): Observable<Boolean> {
    return this.http.get<Boolean>(
      this.getFullUrl(
        `api/v1/registration/check-exist?userId=${userId}&eventId=${eventId}`
      )
    );
  }
  getEventsByUserIdAndStatusAndOrganizerIdAndName(
    userId: number | string,
    eventStatus: string | null,
    itemName?: string | null,
    organizerId?: number | string
  ): Observable<Item[]> {
    return this.http.get<Item[]>(
      this.getFullUrl(
        `api/v1/registration/user/${userId}?eventStatus=${eventStatus}&itemName=${itemName}&organizerId=${organizerId}`
      )
    );
  }
  getRegistrationByUserIdAndEventId(
    userId: number,
    eventId: number
  ): Observable<Registration> {
    return this.http.get<Registration>(
      this.getFullUrl(`api/v1/registration/user/${userId}/event/${eventId}`)
    );
  }
  updateById(id: number, userId: number, r: any): Observable<any> {
    return this.http.patch<void>(
      this.getFullUrl(`api/v1/reservation/${id}/user/${userId}`),
      r
    );
  }
  updateById2(id: number, userId: number, r: any): Observable<any> {
    return this.http.patch<void>(
      this.getFullUrl(`api/v1/registration/${id}/user2/${userId}`),
      r
    );
  }
  getAllRegistrationByFilter(
    tableId: number | string,
    userFullname: string | null,
    status: number | null,
    monthYear: string | null,
    dayMonthYear: string | null
  ): Observable<Registration[]> {
    let params: any = {};

    if (tableId) params.tableId = tableId;
    if (userFullname) params.userFullname = userFullname;
    if (status !== null) params.status = status;
    if (monthYear) params.monthYear = monthYear;
    if (dayMonthYear) params.dayMonthYear = dayMonthYear;

    const queryParams = new HttpParams({ fromObject: params });

    return this.http.get<Registration[]>(
      this.getFullUrl(`api/v1/reservation/filter`),
      { params: queryParams }
    );
  }

  exportToExcel(
    tableId: number | string,
    userFullname: string | null,
    status: number | null,
    monthYear: string | null,
    dayMonthYear: string | null
  ) {
    let params: any = {};

    if (tableId) params.tableId = tableId;
    if (userFullname) params.userFullname = userFullname;
    if (status !== null) params.status = status;
    if (monthYear) params.monthYear = monthYear;
    if (dayMonthYear) params.dayMonthYear = dayMonthYear;

    const queryParams = new HttpParams({ fromObject: params });

    return this.http.get(this.getFullUrl(`api/v1/reservation/export-excel`), {
      params: queryParams,
      responseType: 'blob', // Quan trọng để nhận file nhị phân
    });
  }
}
