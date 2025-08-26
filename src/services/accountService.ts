import {Reader} from "../model/Reader.js";
import {Roles} from "../utils/libTypes.js";

export interface AccountService {
    addAccount: (reader: Reader) => Promise<void>;
    getAccount: (id: string) => Promise<Reader>;
    removeAccount: (id: string) => Promise<Reader>;
    changePassword: (id: string, newPassword: string) => Promise<void>;
    changeReaderData: (id: string, newUserName: string, newEmail: string, newBirthdate: Date) => Promise<void>;
    changeReaderRole: (id: string, newRole: Roles) => Promise<void>
}