import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {BookDbModel} from "../validation/bookMongooseSchema.js";
import {LibService} from "./libService.js";
import {LibServiceImplEmbedded} from "./libServiceImplEmbedded.js";
import {pool} from "../config/libConfig.js";
import {ReaderModel} from "../model/ReaderMongooseModel.js";
import {Reader} from "../model/Reader.js";

const currentDate = (): string => {
    return new Date().toISOString().split("T")[0];
}

export class LibServiceImplMongo implements LibService {
    async addBook(book: Book): Promise<boolean> {
        const newBook = new BookDbModel(book);
        await newBook.save();
        return Promise.resolve(true);
    }

    async getAllBooks(): Promise<Book[]> {
        return await BookDbModel.find().lean<Book[]>().exec();
    }


    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const genreBooks = await BookDbModel.find({genre}).lean<Book[]>().exec();

        if (!genreBooks) throw new HttpError(404, `Books with genre ${genre} not found`);
        return Promise.resolve(genreBooks)
    }


    async pickUpBook(id: string, readerId: string): Promise<void> {
        if (!id || !readerId) {
            throw new HttpError(400, "Data cannot be empty");
        }
        const book = await BookDbModel.findById(id)
        if (!book) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        if (book.status === BookStatus.ON_HAND) {
            throw new HttpError(400, "This book on hand");
        }
        const readerById = await ReaderModel.findById(readerId) as Reader;
        if (!readerById) throw new HttpError(404, `Reader with id ${id} not found`);

        book.pickList.push({
            readerId: readerById._id,
            readerName: readerById.userName,
            pick_date: currentDate(),
            return_date: null
        })
        book.status = BookStatus.ON_HAND;
        await book.save();
    }

    async removeBook(id: string): Promise<Book> {
        const removed = await BookDbModel.findByIdAndUpdate(id, {status: BookStatus.REMOVED}).exec()
        if (!removed) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        return removed as Book;
    }


    async returnBook(id: string): Promise<void> {
        const book = await BookDbModel.findById(id)
        if (!book) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        const activePickIndex = book.pickList.findIndex(record => record.return_date === null);
        if (activePickIndex === -1) {
            throw new HttpError(400, "Book is not currently picked up");
        }
        book.pickList[activePickIndex].return_date = currentDate();
        book.status = BookStatus.ON_STOCK;
        await book.save();

    }

}

export const libServiceMongo = new LibServiceImplMongo();