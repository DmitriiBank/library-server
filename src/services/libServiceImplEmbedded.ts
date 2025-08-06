import {LibService} from "./libService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class LibServiceImplEmbedded implements LibService {
    private books: Book[] = [];
    private get currentDate(): string {
        return new Date().toISOString().split("T")[0];
    }
    addBook(book: Book): boolean {
        const index = this.books.findIndex(item => item.id === book.id)
        if (index === -1) {
            this.books.push(book)
            return true
        }
        return false;
    }

    getAllBooks(): Book[] {
        return [...this.books];
    }

    getBooksByGenre(genre: BookGenres): Book[] {
        const genreBooks = this.books.filter(item => item.genre === genre)
        if (!genreBooks) throw new HttpError(404, `Books with genre ${genre} not found`);
        return genreBooks

    }

    pickUpBook(id: string, reader: string): void {
        const index = this.books.findIndex(item => item.id === id)
        if (index === -1) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        if (!reader || reader.trim().length === 0) {
            throw new HttpError(400, "Reader cannot be empty");
        }
        const book = this.books[index];
        book.pickList.push({
            reader,
            pick_date: this.currentDate,
            return_date: null
        })
        book.status = BookStatus.ON_HAND;
    }

    removeBook(id: string): Book {
        const index = this.books.findIndex(item => item.id === id)
        if (index === -1) throw new HttpError(404, `Book with id ${id} not found`);
        const removedBook =  this.books.splice(index, 1)[0];
        const bookExist = this.books.find(item =>item.title === removedBook.title && item.author === removedBook.author)
        if(!bookExist)  removedBook.status = BookStatus.REMOVED;
        return  removedBook
    }

    returnBook(id: string): void {
        const index = this.books.findIndex(item => item.id === id)
        if (index === -1) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        const book = this.books[index];

        const activePickIndex = book.pickList.findIndex(record => record.return_date === null);
        if (activePickIndex === -1) {
            throw new HttpError(400, "Book is not currently picked up");
        }

        book.pickList[activePickIndex].return_date = this.currentDate;
        book.status = BookStatus.ON_STOCK;

    }

}