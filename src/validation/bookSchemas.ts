import joi from 'joi'
import {BookGenres, BookStatus} from "../model/Book.js";

export const BookDtoSchema = joi.object({
        id: joi.string(),
        title: joi.string().min(2).required(),
        author: joi.string().min(1).required(),
        genre: joi.string().valid(...Object.values(BookGenres)).required(),
        status: joi.string().valid(...Object.values(BookStatus)).required(),
        pickList: joi.array().items(
            joi.object({
                reader: joi.string(),
                pick_date: joi.string().isoDate(),
                return_date: joi.string().isoDate().allow(null)
            })
        ).required(),
        quantity: joi.number().min(1).max(10)
    })


export const PickUpDtoSchema =  joi.object({
        id: joi.string().required(),
        reader: joi.string().required()
    })


export const ReturnDtoSchema =  joi.object({
        id: joi.string().required()
    })

