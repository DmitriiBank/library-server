import express from "express";
import {BookController} from "../controllers/BookController.js";
import {
    BookDtoSchema,
    PickUpDtoSchema,
    ReturnDtoSchema
} from "../validation/bookSchemas.js"
import {bodyValidation} from "../validation/bodyValidation.js";

export const bookRouter = express.Router()

const controller = new BookController();


bookRouter.get('/', controller.getAllBooks);

bookRouter.post('/', bodyValidation(BookDtoSchema), controller.addBook);

bookRouter.get('/genre/:genre', controller.getBooksByGenre);

bookRouter.delete('/', controller.removeBook);

bookRouter.post('/on_stock', bodyValidation(PickUpDtoSchema), controller.pickUpBook);


bookRouter.post('/on_hand', bodyValidation(ReturnDtoSchema), controller.returnBook);

bookRouter.get('/gen_st', controller.getBooksByGengreAndStatus);