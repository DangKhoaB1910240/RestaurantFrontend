import { SuKien } from "../sukien/su-kien";
import { User } from "../user/user";

export class Registration {
    constructor(
        public id:number,
        public event: SuKien,
        public registationDate: Date,
        public status: number,
        public users: User
    ) {

    }
}