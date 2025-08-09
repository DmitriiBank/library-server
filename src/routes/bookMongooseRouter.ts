import express from "express";
import {
    getAllBooks,
    addBook,
    getBooksByGenre,
    removeBook,
    pickUpBook,
    returnBook
} from "../services/libMongooseService.js"
import {BookGenres} from "../model/Book.js";

export const bookRouter = express.Router()

bookRouter.get('/', async (req, res) => {
    const books = await getAllBooks()
    res.json(books)
});

bookRouter.post('/', async (req, res) => {
    try {
        const book = await addBook(req.body)
        res.status(201).json(book)
    } catch (e) {
        const error = e as Error;
        res.status(400).send(error.message)
    }
})

bookRouter.get('/genre/:genre', async (req, res) => {
    try {
        const genre = req.params.genre as BookGenres;
        const booksByGenre = await getBooksByGenre(genre);
        res.status(201).json(booksByGenre)
    } catch (e) {
        const error = e as Error;
        res.status(400).send(error.message)
    }
})
bookRouter.delete('/', async (req, res) => {
    try {
        const removedBook = await removeBook(req.body.id);
        res.status(201).json(removedBook)
    } catch (e) {
        const error = e as Error;
        res.status(400).send(error.message)
    }
})

bookRouter.post('/on_stock', async (req, res) => {
    try {
        const pickedUpBook = await pickUpBook(req.body.id, req.body.reader);
        res.status(201).json(pickedUpBook)
    } catch (e) {
        const error = e as Error;
        res.status(400).send(error.message)
    }
})


bookRouter.post('/on_hand', async (req, res) => {
    try {
        const returnedBook = await returnBook(req.body.id);
        res.status(201).json(returnedBook)
    } catch (e) {
        const error = e as Error;
        res.status(400).send(error.message)
    }
})
