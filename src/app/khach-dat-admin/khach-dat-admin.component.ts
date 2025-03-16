import { Component, ElementRef, OnInit } from '@angular/core';
import { Registration } from '../Models/registration/registration';
import { RegistrationService } from '../Services/registration/registration.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableService } from '../Services/table/table.service';
import { ItemService } from '../Services/item/item.service';
import { ReservationService } from '../Services/reservation/reservation.service';
@Component({
  selector: 'app-khach-dat-admin',
  templateUrl: './khach-dat-admin.component.html',
  styleUrls: ['./khach-dat-admin.component.css'],
})
export class KhachDatAdminComponent implements OnInit {
  isSidebarOpen: boolean = false;
  listDangKy: any[] = [];
  eventId: number | string = '';
  userFullname: string = '';
  status: number | null = null;
  monthYear: string | null = null;
  dayMonthYear: string | null = null;
  filterByMonth: boolean = false;
  selectedDate: string = '';
  selectedReservation: any = null;

  tables: any[] = []; // Danh sách bàn
  menuItems: any[] = []; // Danh sách món ăn
  newOrder: any = {
    tableId: null, // Optional
    items: [],
  };

  constructor(
    private registrationService: RegistrationService,
    private tableService: TableService,
    private itemService: ItemService,
    private elementRef: ElementRef,
    private reservationService: ReservationService
  ) {}
  ngOnInit(): void {
    this.getAllRegistrations();
    this.loadTables();
    this.loadMenuItems();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  openDetailModal(reservation: any) {
    this.selectedReservation = reservation;
  }
  getAllRegistrations() {
    this.registrationService
      .getAllRegistrationByFilter(
        this.eventId,
        this.userFullname,
        this.status,
        this.monthYear,
        this.dayMonthYear
      )
      .subscribe({
        next: (response: Registration[]) => {
          this.listDangKy = response;
        },
        error: (error) => {},
      });
  }
  exportToExcel() {
    this.registrationService
      .exportToExcel(
        this.eventId,
        this.userFullname,
        this.status,
        this.monthYear,
        this.dayMonthYear
      )
      .subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Reservations.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        (error) => {
          console.error('Lỗi khi xuất Excel:', error);
        }
      );
  }

  updateRegistration(id: number, trangThai: number) {
    const object = {
      status: trangThai,
    };
    this.registrationService
      .updateById(id, JSON.parse(localStorage.getItem('userId')!), object)
      .subscribe({
        next: (response: void) => {
          this.getAllRegistrations();
        },
        error: (error) => {},
      });
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
      console.log(this.dayMonthYear);
    } else if (this.selectedDate) {
      // Khi checkbox không được chọn
      const [year, month, day] = this.selectedDate.split('-');
      this.dayMonthYear = `${day}/${month}/${year}`;
      this.selectedDate;
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
      this.dayMonthYear = `${day}/${month}/${year}`;
      this.selectedDate;
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

  // selectedReservation: any = {
  //   user: { fullname: 'Nguyễn Văn A', username: 'nguyenvana' },
  //   table: { tableNumber: 5 },
  //   items: [
  //     {
  //       item: { itemName: 'Món 1', cost: 50000 },
  //       quantity: 2,
  //       totalPrice: 100000,
  //     },
  //     {
  //       item: { itemName: 'Món 2', cost: 75000 },
  //       quantity: 1,
  //       totalPrice: 75000,
  //     },
  //   ],
  //   depositFee: 50000,
  //   totalAmount: 175000,
  //   reservationTime: new Date().toLocaleString(),
  // };

  exportBill(l: any) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('HOA DON NHA HANG', 70, 10);

    doc.setFontSize(12);
    doc.text(`Khach hang: ${l.user ? l.user.fullname : ''}`, 10, 40);
    doc.text(`Ban so: ${l.table ? l.table?.tableNumber : ''}`, 10, 50);
    doc.text(
      `Loai ban: ${l.table?.type === 0 ? 'Bàn thường' : 'Bàn VIP'}`,
      10,
      60
    );
    doc.text(`Ngay dat: ${new Date(l.ngayTao).toLocaleString()}`, 10, 70);
    doc.text(
      `Ngay nhan: ${new Date(l.reservationTime).toLocaleString()}`,
      10,
      80
    );

    autoTable(doc, {
      startY: 90,
      head: [['Ten mon', 'So luong', 'Gia', 'Tong']],
      body: l.items.map((item: any) => [
        item.item.itemName,
        item.quantity,
        `${item.item.cost.toLocaleString()} vnd`,
        `${item.totalPrice.toLocaleString()} vnd`,
      ]),
    });

    const finalY = (doc as any).lastAutoTable
      ? (doc as any).lastAutoTable.finalY
      : 100;

    doc.text(`Tien coc: ${l.depositFee.toLocaleString()} vnd`, 10, finalY + 10);
    doc.text(
      `Tong tien: ${l.totalAmount.toLocaleString()} vnd`,
      10,
      finalY + 20
    );

    doc.save(`HoaDon.pdf`);
  }

  // Grok chỉ
  // Load danh sách bàn từ API
  loadTables() {
    this.tableService.getAll().subscribe({
      next: (response: any[]) => {
        console.log(response);
        this.tables = response;
      },
    });
  }

  // Load danh sách món ăn từ API
  loadMenuItems() {
    this.itemService.getItem().subscribe({
      next: (response: any[]) => {
        this.menuItems = response;
      },
    });
  }

  ngAfterViewInit() {
    // Lắng nghe sự kiện khi modal关闭
    const modalElement =
      this.elementRef.nativeElement.querySelector('#addOrderModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  // Reset form về trạng thái ban đầu
  resetForm() {
    this.newOrder = {
      tableId: null,
      items: [],
    };
  }

  // Load danh sách đơn hàng (nếu cần)
  loadOrders() {
    // this.http.get<any[]>('YOUR_API_ENDPOINT/orders').subscribe((data) => {
    //   this.listDangKy = data;
    // });
  }

  // Thêm một món mới vào danh sách items
  addItem() {
    this.newOrder.items.push({ itemId: null, quantity: 1 });
  }

  // Xóa một món khỏi danh sách items
  removeItem(index: number) {
    this.newOrder.items.splice(index, 1);
  }

  // Tạo đơn hàng mới
  createOrder() {
    const orderData = {
      tableId: this.newOrder.tableId, // Có thể là null
      items: this.newOrder.items.filter(
        (item: { itemId: any; quantity: number }) =>
          item.itemId && item.quantity > 0
      ), // Lọc các món hợp lệ
    };

    this.reservationService.bookAdmin(orderData).subscribe(
      (response) => {
        console.log('Đơn hàng đã được tạo:', response);
        this.resetForm(); // Reset form khi thành công
        this.loadOrders(); // Render lại danh sách đơn hàng
        this.getAllRegistrations();
        const modal = document.getElementById('addOrderModal');
        if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      },
      (error) => {
        console.error('Lỗi khi tạo đơn hàng:', error);
      }
    );
  }
}
