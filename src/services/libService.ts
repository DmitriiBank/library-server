import {Book, BookGenres} from "../model/Book.js";

export interface LibService {
    addBook: (book: Book) => boolean,
    removeBook: (id:string) => Book,
    pickUpBook: (id:string, reader:string) => void,
    returnBook: (id:string) => void,
    getAllBooks: () => Book[];
    getBooksByGenre: (genre:BookGenres) => Book[]
}