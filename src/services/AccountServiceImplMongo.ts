import {AccountService} from "./accountService.js";
import {Reader} from "../model/Reader.js";
import {ReaderModel} from "../validation/ReaderMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";


export class AccountServiceImplMongo implements AccountService {
    async addAccount(reader: Reader): Promise<void> {
        try {
            const temp = await ReaderModel.findById(reader._id)
            if (temp) throw new HttpError(409, "Reader already exists")
            const readerDoc = new ReaderModel(reader)
            await readerDoc.save()
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to add account: ${error.message}`);
        }
    }

    async changePassword(id: string, newPassword: string): Promise<void> {
        try {
            const editReaderPassword = await ReaderModel.findById(id);
            if (!editReaderPassword) throw new HttpError(409, `Reader with id ${id} not found`)
            const isSame = await bcrypt.compare(newPassword, editReaderPassword.passHash);
            if (isSame) {
                throw new HttpError(400, "The new password must not be the same as the old one");
            }
            const newPassHash = await bcrypt.hash(newPassword, 10);
            editReaderPassword.passHash = newPassHash;
            await editReaderPassword.save()
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to change password: ${error.message}`);
        }
    }

    async getAccount(id: string): Promise<Reader> {
        try {
            const readerById = await ReaderModel.findById(id) as Reader;
            if (!readerById) throw new HttpError(404, `Reader with id ${id} not found`);
            return readerById
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to retrieve books by genre: ${error.message}`);
        }
    }


    async removeAccount(id: string): Promise<Reader> {
        try {
            const deleted = await ReaderModel.findByIdAndDelete(id) as Reader;
            if (!deleted) throw new HttpError(404, `Reader with id ${id} not found`);
            return deleted
        } catch (error: any) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(500, `Failed to retrieve books by genre: ${error.message}`);
        }
    }

}

export const accountServiceImplMongo = new AccountServiceImplMongo()