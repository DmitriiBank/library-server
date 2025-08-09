import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {BookDbModel} from "../validation/bookMongooseSchema.js";

const currentDate = ():string => {
    return new Date().toISOString().split("T")[0];
}

export const addBook = async (book: Book) => {
    try {
        const newBook = new BookDbModel(book);
        return await newBook.save()
    } catch (error: any) {
        throw new HttpError(400, `Failed to add book: ${error.message}`);
    }
}

export const getAllBooks = () => {
    return BookDbModel.find()
}

export const getBooksByGenre = async (genre: BookGenres) => {
    try {
        const genreBooks = await BookDbModel.find({genre})

        if (!genreBooks) throw new HttpError(404, `Books with genre ${genre} not found`);
        return genreBooks
    } catch (error: any) {
        if (error instanceof HttpError) throw error;
        throw new HttpError(500, `Failed to retrieve books by genre: ${error.message}`);
    }
}

export const pickUpBook = async (id: string, reader: string) => {
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
        return await book.save();
    } catch (error: any) {
        if (error instanceof HttpError) throw error;
        throw new HttpError(500, `Failed to pick up book: ${error.message}`);
    }
}

export const removeBook = async (id: string) => {
    try {
        const book = await BookDbModel.findById(id)
        if (!book) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        book.status = BookStatus.REMOVED;
        return await book.save();
    } catch (error: any) {
        if (error instanceof HttpError) throw error;
        throw new HttpError(500, `Failed to remove book: ${error.message}`);
    }
}

export const returnBook = async (id: string) => {
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
        return await book.save();
    }catch (error: any) {
        if (error instanceof HttpError) throw error;
        throw new HttpError(500, `Failed to return book: ${error.message}`);
    }

}