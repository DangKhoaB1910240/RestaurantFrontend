import { NhaToChuc } from "../nhatochuc/nha-to-chuc";

export class SuKien {
    constructor(
      public id: number,
      public eventName: string,
      public startDateTime: Date,
      public endDateTime: Date,
      public description: string,
      public maxQuantity: number,
      public status: boolean,
      public totalRegistered: number,
      public totalAttended: number,
      public img: string,
      public tinhThanhId: number,
      public quanHuyenId: number,
      public phuongXaId: number,
      public address: string,
      public cost: number,
      public organizer: NhaToChuc, // Sử dụng class Organizer hoặc thay thế bằng dữ liệu tương ứng
      public fullAddress?: string // Thêm thuộc tính fullAddress
    ) {}
  }