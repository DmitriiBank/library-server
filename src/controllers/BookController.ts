import {Request, Response} from "express";
import {Book, BookDto, BookGenres, BookStatus} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {convertBookDtoToBook} from "../utils/tools.js";
//import {libServiceEmbedded as service} from "../services/libServiceImplEmbedded.js";
//import {libServiceMongo as service} from "../services/libMongooseService.js";
import {libServiceSql as libService} from "../services/libServiceImplSQL.js";

export class BookController {
    // private libService: LibService = new LibServiceImplEmbedded();

    async getAllBooks(req: Request, res: Response) {
        const result = await libService.getAllBooks();
        res.json(result)
    }

    async addBook(req: Request, res: Response) {
        const dto = req.body as BookDto
        const book: Book = convertBookDtoToBook(dto);
        const result = await libService.addBook(book);
        if (result) res.status(201).json(book)
        else throw new HttpError(409, "Book not add")
    }

    async getBooksByGenre(req: Request, res: Response) {
        const genre = req.params.genre as BookGenres;
        if (!genre || !(Object.values(BookGenres).includes(genre)))
            throw new HttpError(400, "Genre not valid or missing");
        const founded = await libService.getBooksByGenre(genre);
        if (founded !== null) {
            res.status(200).json(founded)
        } else {
            res.status(200).send('Books not found')
        }

    }

    async removeBook(req: Request, res: Response) {
        const bookId = req.body.id;
        if (!bookId)
            throw new HttpError(400, "Invalid book ID");

        const removed = await libService.removeBook(bookId);
        if (removed) {
            res.status(200).json(removed);
        } else {
            res.status(200).send("Book not found");
        }
    }

    async pickUpBook(req: Request, res: Response) {
        const {id, reader} = req.body
        if (!id)
            throw new HttpError(400, "Book not found");
        if (!reader)
            throw new HttpError(400, "Reader not added");
        await libService.pickUpBook(id, reader);
        res.status(200).json({message: "Book picked up"});

    }

    async returnBook(req: Request, res: Response) {
        const {id} = req.body as Book
        if (!id)
            throw new HttpError(400, "Book not found");
        await libService.returnBook(id);
        res.status(200).json({message: "Book returned"});
    }

    async getBooksByGengreAndStatus(req: Request, res: Response) {
        const {genre, status} = req.query;
        const genre_upd = genre as BookGenres
        const status_upd = status as BookStatus
        if (!genre_upd || !(Object.values(BookGenres).includes(genre_upd)))
            throw new HttpError(400, "Genre not valid or missing");
        if (!status_upd || !(Object.values(BookStatus).includes(status_upd)))
            throw new HttpError(400, "Status not valid or missing");
        const result = await libService.getBooksByGenreAndStatus(genre_upd, status_upd);
        res.json(result);
    }
}