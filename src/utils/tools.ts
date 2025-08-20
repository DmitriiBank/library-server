import {BookDto, BookGenres, BookStatus} from "../model/Book.js";
import {v4 as uuidv4} from 'uuid'
import {HttpError} from "../errorHandler/HttpError.js";
import {ReaderDto} from "../model/Reader.js";
import bcrypt from 'bcryptjs'

function getGenre(genre: string) {
    const bookGenre = Object.values(BookGenres).find(v => v === genre)
    if(!bookGenre) throw  new HttpError(400, "Wrong genre")
    else return bookGenre
}

export const convertBookDtoToBook = (dto: BookDto)=> {
    return {
        id: uuidv4(),
        title: dto.title,
        author: dto.author,
        genre: getGenre(dto.genre),
        status: BookStatus.ON_STOCK,
        pickList: []
    }
}

export const convertReaderDtoToReader = async (dto: ReaderDto) => {
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    return {
        _id: String(dto.id),
        userName: dto.userName,
        email: dto.email,
        birthdate: dto.birthdate,
        passHash: hashedPassword
    }
}

