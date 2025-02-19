
import { Item } from "../sukien/su-kien";
import { User } from "../user/user";

export class Registration {
    constructor(
        public id:number,
        public event: Item,
        public registrationDate: Date,
        public status: number,
        public users: User,
        public paymentMethod: number,
        public refuseMessage: string,
        public loaiGhe: number
    ) {

    }
}