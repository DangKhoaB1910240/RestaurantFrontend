import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/Models/category/category';
import { Item } from 'src/app/Models/sukien/su-kien';
import { AppConfig } from 'src/app/config/AppConfig';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient, private router: Router) { }

  //lấy full đường dẫn
  private getFullUrl(endpoint: string): string {
    return `${AppConfig.baseUrl}/${endpoint}`;
  }
  getItem(): Observable<Item[]> {
    return this.http.get<Item[]>(
      this.getFullUrl(`api/v1/item`)
    );
  }
  getItemByOrganizerId(organizerId: number): Observable<Item[]> {
    return this.http.get<Item[]>(
      this.getFullUrl(`api/v1/item/by-organizer?organizerId=${organizerId}`)
    );
  }
  getEventsByStatus(status: string): Observable<Item[]> {
    return this.http.get<Item[]>(
      this.getFullUrl(`api/v1/item/status?status=${status}`)
    );
  }
  getEventsByStatusAndOrganizerIdAndName(eventStatus: string | null, itemName?: string | null, organizerId?: number | string): Observable<Item[]> {
    return this.http.get<Item[]>(
      this.getFullUrl(`api/v1/item/filter?eventStatus=${eventStatus}&itemName=${itemName}&organizerId=${organizerId}`)
    );
  }
  getEventById(eventId: number): Observable<Item> {
    return this.http.get<Item>(
      this.getFullUrl(`api/v1/item/${eventId}`)
    );
  }
  getTop5ItemByOrganizerIdExcludingEventId(organizerId: number| string, eventId: number|string): Observable<Item[]> {
    return this.http.get<Item[]>(
      this.getFullUrl(`api/v1/item/by-organizer-excluding?organizerId=${organizerId}&eventId=${eventId}`)
    );
  }
  deleteById(id: number, userId:number) : Observable<any> {
    return this.http.delete<void>(this.getFullUrl(`api/v1/item/${id}/user/${userId}`));
  }
  addItem(userId:number, Item: Item): Observable<any> {
    return this.http.post<void>(this.getFullUrl(`api/v1/item/user/${userId}`),Item);
  }
  updateById(id:number, userId: number, Item: Item): Observable<any> {
    return this.http.patch<void>(this.getFullUrl(`api/v1/item/${id}/user/${userId}`),Item);
  }
}
