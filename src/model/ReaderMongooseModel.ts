import mongoose from "mongoose";
import {Roles} from "../utils/libTypes.js";

export const  readerMongooseSchema = new mongoose.Schema({
    _id:       { type: String, required: true },
    userName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, unique: true, index: true },
    birthdate: { type: Date,   required: true },
    passHash:  { type: String, required: true },
    roles: { type: [String], enum: Object.values(Roles), required: true}
}, { timestamps: true });

export const ReaderModel = mongoose.model('Reader', readerMongooseSchema, 'reader_collection')