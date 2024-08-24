import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../Services/logger/logger.service';
import { Logger } from '../Models/logger/logger';
import { NhaToChucService } from '../Services/nhatochuc/nha-to-chuc.service';
import { SuKienService } from '../Services/sukien/su-kien.service';
import { NhaToChuc } from '../Models/nhatochuc/nha-to-chuc';
import { SuKien } from '../Models/sukien/su-kien';
import { Registration } from '../Models/registration/registration';
import { RegistrationService } from '../Services/registration/registration.service';
@Component({
  selector: 'app-khach-dat-admin',
  templateUrl: './khach-dat-admin.component.html',
  styleUrls: ['./khach-dat-admin.component.css']
})
export class KhachDatAdminComponent implements OnInit{
  isSidebarOpen: boolean = false; 
  listDangKy: Registration[] = [];
  eventId: number | string = '';
  userFullname: string = '';
  status: number | null = null;
  monthYear: string | null = null;
  dayMonthYear: string | null = null;
  filterByMonth: boolean = false;
  selectedDate: string = '';
  constructor(
    private registrationService: RegistrationService
  ) { }
  ngOnInit(): void {
    this.getAllRegistrations();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  getAllRegistrations() {
    this.registrationService.getAllRegistrationByFilter(this.eventId,this.userFullname,this.status,this.monthYear,this.dayMonthYear).subscribe({
      next: (response: Registration[]) => {
        this.listDangKy = response;
      },
      error: (error) => {

      }
    })
  }
  updateRegistration(id:number ,trangThai: number) {
    const object = {
      status: trangThai
    };
    this.registrationService.updateById(id,JSON.parse(localStorage.getItem('userId')!),object).subscribe({
      next: (response : void)=> {
        
        this.getAllRegistrations();
      },
      error: (error) => {

      }
    })
  }
  onStatusChange(value: string) {
    this.status = value ? Number(value) : null;
    this.getAllRegistrations();
}

onFilterByMonthChange(event: any) {
    // Khi checkbox được chọn
    if (this.filterByMonth && this.selectedDate) {
        const [year, month] = this.selectedDate.split('-');
        this.monthYear = `${month}/${year}`;
        this.dayMonthYear = null;
        console.log(this.dayMonthYear)
    } else if (this.selectedDate) {
        // Khi checkbox không được chọn
        const [year, month, day] = this.selectedDate.split('-');
        this.dayMonthYear = `${day}/${month}/${year}`;this.selectedDate;
        this.monthYear = null;
    }
    this.getAllRegistrations();
}

onDateChange(event: any) {
  console.log(this.selectedDate);
    if (this.filterByMonth && this.selectedDate) {
        const [year, month] = this.selectedDate.split('-');
        this.monthYear = `${month}/${year}`;
        this.dayMonthYear = null;
    } else {
      const [year, month, day] = this.selectedDate.split('-');
      this.dayMonthYear = `${day}/${month}/${year}`;this.selectedDate;
        this.monthYear = null;
    }
    this.getAllRegistrations();
}

resetFilters() {
    this.userFullname = '';
    this.status = null;
    this.monthYear = null;
    this.dayMonthYear = null;
    this.filterByMonth = false;
    this.selectedDate = '';
    this.getAllRegistrations();
}
}
