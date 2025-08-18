import {RowDataPacket} from "mysql2";

export type BookDto = {
    title: string,
    author: string,
    genre: string,
    quantity?: number
}

export type Book = {
    id: string,
    title: string,
    author: string,
    genre: BookGenres,
    status: BookStatus,
    pickList: PickRecord[]
}

export interface BookRow extends RowDataPacket {
    id: string;
    title: string;
    author: string;
    genre: string;
    status: string;
    reader_id: number | null;
    reader: string | null;
    pick_date: string | null;
    return_date: string | null;
}

export type Reader = {
    id: string,
    full_name: string
}

export enum BookGenres {
    SCI_FI = "sci_fi",
    FANTASY = "fantasy",
    MYSTERY = "mystery",
    THRILLER = "thriller",
    ROMANCE = "romance",
    HORROR = "horror",
    NON_FICTION = "non_fiction",
    BIOGRAPHY = "biography",
    HISTORY = "history",
    POETRY = "poetry",
    ADVENTURE = "adventure",
    DRAMA = "drama",
    COMEDY = "comedy",
    SELF_HELP = "self_help",
    CHILDREN = "children",
    YOUNG_ADULT = "young_adult",
    PHILOSOPHY = "philosophy",
    BUSINESS = "business",
    RELIGION = "religion",
    EDUCATIONAL = "educational",
    CLASSIC='classic'
}


export enum BookStatus {
    ON_STOCK = "on_stock",
    ON_HAND = "on_hand",
    REMOVED = "removed"
}

export type PickRecord = {
    reader: string,
    pick_date: string,
    return_date: string | null
}