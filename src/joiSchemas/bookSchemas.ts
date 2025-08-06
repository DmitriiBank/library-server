import joi from 'joi'
import {BookGenres, BookStatus} from "../model/Book.js";

export const BookDtoSchema = {
    body: joi.object({
        id: joi.string(),
        title: joi.string().required(),
        author: joi.string().required(),
        genre: joi.string().valid(...Object.values(BookGenres)).required(),
        status: joi.string().valid(...Object.values(BookStatus)).required(),
        pickList: joi.array().items(
            joi.object({
                reader: joi.string(),
                pick_date: joi.string().isoDate(),
                return_date: joi.string().isoDate().allow(null)
            })
        ).required()
    })
}

export const PickUpDtoSchema = {
    body: joi.object({
        id: joi.string().required(),
        reader: joi.string().required()
    })
};

export const ReturnDtoSchema = {
    body: joi.object({
        id: joi.string().required()
    })
};
