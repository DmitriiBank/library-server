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

bookRouter.get('/genre', controller.getBooksByGenre);

bookRouter.delete('/', controller.removeBook);

bookRouter.post('/pickup', bodyValidation(PickUpDtoSchema), controller.pickUpBook);


bookRouter.post('/return', bodyValidation(ReturnDtoSchema), controller.returnBook);

// bookRouter.get('/gen_st', controller.getBooksByGengreAndStatus);