import express, {Request, Response, NextFunction} from "express";
import {BookController} from "../controllers/BookController.js";
import {myLogger} from "../utils/logger.js";
import asyncHandler from "express-async-handler";
import {
    BookDtoSchema,
    PickUpDtoSchema,
    ReturnDtoSchema
} from "../joiSchemas/bookSchemas.js"
import {validate} from 'express-validation';

export const bookRouter = express.Router()

const controller = new BookController();

bookRouter.use((req: Request, res: Response, next: NextFunction) => {
    myLogger.log(`Request "books${req.url}" was received`)
    next()
})

bookRouter.use((req: Request, res: Response, next: NextFunction) => {
    myLogger.save(`Request "books${req.url}" was received`)
    next()
})

bookRouter.get('/', asyncHandler(async (req, res) => {
    await controller.getAllBooks(req, res);
}));

bookRouter.post('/', validate(BookDtoSchema), asyncHandler(async (req, res) => {
    await controller.addBook(req, res);
}));

bookRouter.get('/genre/:genre', asyncHandler(async (req, res) => {
    await controller.getBooksByGenre(req, res);
}));

bookRouter.delete('/', asyncHandler(async (req, res) => {
    await controller.removeBook(req, res);
}));

bookRouter.post('/on_stock', validate(PickUpDtoSchema), asyncHandler(async (req, res) => {
    await controller.pickUpBook(req, res);
}));

bookRouter.post('/on_hand', validate(ReturnDtoSchema), asyncHandler(async (req, res) => {
    await controller.returnBook(req, res);
}));

bookRouter.get('/logs', asyncHandler(async (req: Request, res: Response) => {
    await controller.getLogArray(req, res);
}));