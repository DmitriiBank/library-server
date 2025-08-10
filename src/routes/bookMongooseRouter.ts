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
import asyncHandler from "express-async-handler";

export const bookRouter = express.Router()

bookRouter.get('/', asyncHandler(async (req, res) => {
    const books = await getAllBooks()
    res.json(books)
}));

bookRouter.post('/', asyncHandler(async (req, res) => {
        const book = await addBook(req.body)
        res.status(201).json(book)
}))
bookRouter.get('/genre/:genre', asyncHandler(async (req, res) => {
    const genre = req.params.genre as BookGenres;
    const booksByGenre = await getBooksByGenre(genre);
    res.status(201).json(booksByGenre);
}));

bookRouter.delete('/', asyncHandler(async (req, res) => {
    const removedBook = await removeBook(req.body.id);
    res.status(201).json(removedBook);
}));

bookRouter.post('/on_stock', asyncHandler(async (req, res) => {
    const pickedUpBook = await pickUpBook(req.body.id, req.body.reader);
    res.status(201).json(pickedUpBook);
}));

bookRouter.post('/on_hand', asyncHandler(async (req, res) => {
    const returnedBook = await returnBook(req.body.id);
    res.status(201).json(returnedBook);
}));
