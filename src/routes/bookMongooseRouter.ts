import express from "express";
import {BookController} from "../controllers/BookMongooseController.js";
import asyncHandler from "express-async-handler";

export const bookRouter = express.Router()

const controller = new BookController();

bookRouter.get('/', asyncHandler(async (req, res) => {
    await controller.getAllBooks(req, res);
}));

bookRouter.post('/', asyncHandler(async (req, res) => {
    await controller.addBook(req, res);
}));

bookRouter.get('/genre/:genre', asyncHandler(async (req, res) => {
    await controller.getBooksByGenre(req, res);
}));

bookRouter.delete('/', asyncHandler(async (req, res) => {
    await controller.removeBook(req, res);
}));

bookRouter.post('/on_stock',  asyncHandler(async (req, res) => {
    await controller.pickUpBook(req, res);
}));

bookRouter.post('/on_hand', asyncHandler(async (req, res) => {
    await controller.returnBook(req, res);
}));

