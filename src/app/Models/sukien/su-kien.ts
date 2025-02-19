import { Category } from "../category/category";


export class Item {
    constructor(
      public id: number,
      public itemName: string,
      public description: string,
      public status: boolean,
      public img: string,
      public cost: number,
      public category: Category, // Sử dụng class Organizer hoặc thay thế bằng dữ liệu tương ứng
    ) {}
  }