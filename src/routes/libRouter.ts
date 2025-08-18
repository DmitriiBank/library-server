
import express from "express";
// import {bookRouter} from "./bookMongooseRouter.js";
import {bookRouter} from "./bookRouter.js";

export const libRouter = express.Router()

libRouter.use('/books', bookRouter)