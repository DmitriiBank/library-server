import mongoose from "mongoose";
import {BookGenres, BookStatus} from "../model/Book.js";

const PickRecordSchema = new mongoose.Schema({
    reader: { type: String, required: true },
    pick_date: { type: String, required: true},
    return_date: { type: String, default: null }
}, { _id: false });

export const  BookDtoMongooseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    genre: {type: String, enum: Object.values(BookGenres), required: true},
    status: {type: String, enum: Object.values(BookStatus), required: true},
    pickList: {
        type: [PickRecordSchema],
        required: true,
        default: []
    },
    quantity: {type: Number, required: false},
})

export const  PickUpMongooseSchema = new mongoose.Schema({
    id: {type: String, required: true},
    reader: {type: String, required: true},
})

export const  ReturnMongooseSchema = new mongoose.Schema({
    id: {type: String, required: true},
})

export const BookDbModel = mongoose.model('Book', BookDtoMongooseSchema, 'book_collection')
