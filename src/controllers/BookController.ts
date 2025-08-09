import {LibService} from "../services/libService.js";
import {LibServiceImplEmbedded} from "../services/libServiceImplEmbedded.js";
import {Response, Request} from "express";
import {Book, BookDto, BookGenres, PickRecord} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {convertBookDtoToBook} from "../utils/tools.js";


export class BookController {
    private libService: LibService = new LibServiceImplEmbedded();

    async getAllBooks(req: Request, res: Response) {
        const result = this.libService.getAllBooks();
        res.json(result)
    }

    async addBook(req: Request, res: Response) {
        const dto = req.body as BookDto
        const book: Book = convertBookDtoToBook(dto);
        const result = this.libService.addBook(book);
        if (result) res.status(201).json(book)
        else throw new HttpError(409, "Book not add")
    }

    async getBooksByGenre(req: Request, res: Response) {
        const genre = req.params.genre as BookGenres;
        if (!genre || !(Object.values(BookGenres).includes(genre)))
            throw new HttpError(400, "Genre not valid or missing");
        const founded = this.libService.getBooksByGenre(genre);
        if (founded !== null) {
            res.status(200).json(founded)
            } else {
            res.status(200).send('Books not found')
             }

    }

    async removeBook (req: Request, res: Response) {
        const bookId = req.body.id;
        if (!bookId)
            throw new HttpError(400, "Invalid book ID");

        const removed = this.libService.removeBook(bookId);
        if (removed) {
            res.status(200).json(removed);
           } else {
            res.status(200).send("Book not found");
          }
    }

    async pickUpBook(req: Request, res: Response) {
        const { id, reader } = req.body
        if (!id)
            throw new HttpError(400, "Book not found");
        if (!reader)
            throw new HttpError(400, "Reader not added");
        this.libService.pickUpBook(id, reader);
        res.status(200).json({message: "Book picked up"});

    }

    async returnBook(req: Request, res: Response) {
        const {id} = req.body as Book
        if (!id)
            throw new HttpError(400, "Book not found");
       this.libService.returnBook(id);
        res.status(200).json({message: "Book returned"});
    }

}