import express, {Request, Response, NextFunction} from "express";
import {BookController} from "../controllers/BookController.js";
import {
    BookDtoSchema,
    PickUpDtoSchema,
    ReturnDtoSchema
} from "../validation/bookSchemas.js"
import {bodyValidation} from "../validation/bodyValidation.js";

export const bookRouter = express.Router()

const controller = new BookController();


bookRouter.get('/', controller.getAllBooks.bind(controller));

bookRouter.post('/', bodyValidation(BookDtoSchema), controller.addBook.bind(controller));

bookRouter.get('/genre/:genre', controller.getBooksByGenre.bind(controller));

bookRouter.delete('/', controller.removeBook.bind(controller));

bookRouter.post('/on_stock', bodyValidation(PickUpDtoSchema), controller.pickUpBook.bind(controller));


bookRouter.post('/on_hand', bodyValidation(ReturnDtoSchema), controller.returnBook.bind(controller));

