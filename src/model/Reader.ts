import {Roles} from "../utils/libTypes.js";

export type ReaderDto = {
    id: number,
    email: string,
    password: string,
    userName: string,
    birthdate: string
}

export type Reader = {
    _id: string,
    userName: string,
    email: string,
    birthdate: string,
    passHash: string,
    roles: Roles[]
}

