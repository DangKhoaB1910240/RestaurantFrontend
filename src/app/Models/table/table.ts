export class Table {
  constructor(
    public id: number,
    public tableNumber: string,
    public capacity: number,
    public isAvailable: boolean,
    public type: number,
    public price?: number
  ) {}
}
