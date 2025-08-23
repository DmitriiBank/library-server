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

export const ReaderDtoSchema = joi.object({
    id: joi.number().positive().max(999999999).min(100000000),
    userName: joi.string().min(1).required(),
    email: joi.string().email().required(),
    birthdate: joi.string().isoDate().required(),
    password: joi.string().alphanum().min(8).required()
})

export const ChangePassDtoSchema = joi.object({
    id: joi.number().positive().max(999999999).min(100000000),
    newPassword: joi.string().alphanum().min(8).required()
})

export const ChangeDataDtoSchema = joi.object({
    id: joi.number().positive().max(999999999).min(100000000),
    newUserName: joi.string().min(1),
    newEmail: joi.string().email(),
    newBirthdate: joi.string().isoDate(),
})

export const PickUpDtoSchema =  joi.object({
        id: joi.string().required(),
        reader: joi.string().required()
    })


export const ReturnDtoSchema =  joi.object({
        id: joi.string().required()
    })

