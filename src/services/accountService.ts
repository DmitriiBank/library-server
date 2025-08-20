import {Reader} from "../model/Reader.js";

export interface AccountService {
    addAccount: (reader: Reader) => Promise<void>;
    getAccount: (id: string) => Promise<Reader>;
    removeAccount: (id: string) => Promise<Reader>;
    changePassword: (id: string, newPassword: string) => Promise<void>;
}