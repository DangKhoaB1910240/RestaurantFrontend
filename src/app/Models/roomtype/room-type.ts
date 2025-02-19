import { Image } from '../image/image';

export class RoomType {
  constructor(
    public id: number,
    public name: string,
    public maxQuantity: number,
    public price: number,
    public isAirConditioned: boolean,
    public isCooked: boolean,
    public enable: boolean,
    public createdDate: string,
    public updatedDate: string,
    public images: Image[]
  ) {}
  getId(): number {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getPrice(): number {
    return this.price;
  }
  getIsAirConditioned(): boolean {
    return this.isAirConditioned;
  }
  getIsCooked(): boolean {
    return this.isCooked;
  }
  getEnable(): boolean {
    return this.enable;
  }
  getCreatedDate(): string {
    return this.createdDate;
  }
  getUpdatedDate(): string {
    return this.updatedDate;
  }
  getImages(): Image[] {
    return this.images;
  }
}
