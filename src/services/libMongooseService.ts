import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {BookDbModel} from "../validation/bookMongooseSchema.js";
import {LibService} from "./libService.js";

const currentDate = ():string => {
    return new Date().toISOString().split("T")[0];
}
export class LibServiceImplMongo implements LibService {
    async addBook(book: Book): Promise<boolean> {
        try {
            const newBook = new BookDbModel(book);
            await newBook.save();
            return Promise.resolve(true);
        } catch (error: any) {
            throw new HttpError(400, `Failed to add book: ${error.message}`);
        }
    }

   async getAllBooks (): Promise<Book[]> {
        return await BookDbModel.find().exec() as Book[];
    }


    async  getBooksByGenre (genre: BookGenres): Promise<Book[]> {
        try {
            const genreBooks = await BookDbModel.find({genre}).exec() as Book[];

            if (!genreBooks) throw new HttpError(404, `Books with genre ${genre} not found`);
            return Promise.resolve(genreBooks)
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to retrieve books by genre: ${error.message}`);
        }
    }


     async pickUpBook (id: string, reader: string): Promise<void> {
        try {
            if (!id || !reader || reader.trim().length === 0) {
                throw new HttpError(400, "Reader name cannot be empty");
            }
            const book = await BookDbModel.findById(id)
            if (!book) {
                throw new HttpError(404, `Book with id ${id} not found`);
            }
            if (book.status === BookStatus.ON_HAND) {
                throw new HttpError(400, "This book on hand");
            }
            book.pickList.push({
                reader,
                pick_date: currentDate(),
                return_date: null
            })
            book.status = BookStatus.ON_HAND;
            await book.save();
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to pick up book: ${error.message}`);
        }
    }

     async removeBook (id: string): Promise<Book> {
        try {
            const book = await BookDbModel.findById(id)
            if (!book) {
                throw new HttpError(404, `Book with id ${id} not found`);
            }
            book.status = BookStatus.REMOVED;
            await book.save();
            return Promise.resolve(book as Book)
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to remove book: ${error.message}`);
        }
    }


     async returnBook(id: string) : Promise<void> {
        try {
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
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to return book: ${error.message}`);
        }

    }
}