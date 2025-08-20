import {LibService} from "./libService.js";
import {Book, BookGenres, BookRow, BookStatus} from "../model/Book.js";
import {pool} from "../config/libConfig.js";
import {HttpError} from "../errorHandler/HttpError.js";


export class LibServiceImplSQL implements LibService {
    getBookById = async (id: string) => {
        const [result] = await pool.query(
            `SELECT id, status
             FROM books
             WHERE id = ?`,
            [id]
        );
        return (result as any[])[0]
    }
    async addBook(book: Book): Promise<boolean> {
        const result = await pool.query('INSERT INTO books VALUES(?,?,?,?,?)',
            [book.id, book.title, book.author, book.genre, book.status])
        if (!result) return Promise.resolve(false)
        return Promise.resolve(true);
    }

    async getAllBooks(): Promise<Book[]> {
        const [rows] = await pool.query<BookRow[]>(
            `
        SELECT 
            b.id,
            b.title,
            b.author,
            b.genre,
            b.status,
            r.reader,
            DATE_FORMAT(br.pick_date, '%Y-%m-%d') AS pick_date,
            DATE_FORMAT(br.return_date, '%Y-%m-%d') AS return_date
        FROM books b
        LEFT JOIN books_readers br ON b.id = br.book_id
        LEFT JOIN readers r ON br.reader_id = r.id
        ORDER BY b.title;
        `
        );
        const books = new Map<string, Book>();

        for (const row of rows) {
            if (!books.has(row.id)) {
                books.set(row.id, {
                    id: row.id,
                    title: row.title,
                    author: row.author,
                    genre: row.genre as BookGenres,
                    status: row.status as BookStatus,
                    pickList: []
                });
            }

            if (row.reader_id !== null) {
                books.get(row.id)!.pickList.push({
                    reader: row.reader ?? '',
                    pick_date: row.pick_date!,
                    return_date: row.return_date
                });
            }
        }

        return Array.from(books.values());
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const [rows] = await pool.query(
            `SELECT id, title, author, genre, status
             FROM books
             WHERE genre = ?
             ORDER BY title`,
            [genre]
        );
        return Promise.resolve(rows as Book[]);
    }

    async pickUpBook(id: string, reader: string): Promise<void> {

        const book = await this.getBookById(id)
        if (!book) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        if (book.status !== BookStatus.ON_STOCK) {
            throw new Error("Book is not available");
        }

        const [rows] = await pool.query(
            'SELECT id FROM readers WHERE reader = ?',
            [reader]
        );

        let readerId: number;

        if ((rows as any[]).length > 0) {
            readerId = (rows as any[])[0].id;
        } else {
            const [result] = await pool.query(
                'INSERT INTO readers (reader) VALUES (?)',
                [reader]
            );
            readerId = (result as any).insertId;
        }

        await pool.query(
            'INSERT INTO books_readers (book_id, reader_id, pick_date) VALUES(?, ?, CURDATE())',
            [id, readerId]
        )

        await pool.query(
            `UPDATE books
             SET status = 'on_hand'
             WHERE id = ?`, [id]);
    }

    async removeBook(bookId: string): Promise<Book> {
        const book = await this.getBookById(bookId)
        if (!book) {
            throw new HttpError(404, `Book with id ${bookId} not found`);
        }

        await pool.query(
            `UPDATE books
             SET status = 'removed'
             WHERE id = ?`,
            [bookId]);
        return Promise.resolve(book)
    }

    async returnBook(id: string): Promise<void> {
        const book = await this.getBookById(id)

        if (!book) {
            throw new HttpError(404, `Book with id ${id} not found`);
        }
        if (book.status === BookStatus.ON_HAND) {
            await pool.query(
                `UPDATE books_readers
                 SET return_date = CURDATE()
                 WHERE book_id = ?
                   AND return_date IS NULL`,
                [id]);

            await pool.query(
                `UPDATE books
                 SET status = 'on_stock'
                 WHERE id = ?`,
                [id]);
        }
    }

    async getBooksByGenreAndStatus(genre: BookGenres, status: BookStatus):Promise<Book[]> {
        const [rows] = await pool.query(
            `SELECT id, title, author, genre, status
             FROM books
             WHERE genre = ? AND status = ?
             ORDER BY title`,
            [genre, status]
        );
        return Promise.resolve(rows as Book[]);
    }
}

export const libServiceSql = new LibServiceImplSQL()