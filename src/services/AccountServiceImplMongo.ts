import {AccountService} from "./accountService.js";
import {Reader} from "../model/Reader.js";
import {ReaderModel} from "../model/ReaderMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
import {Roles} from "../utils/libTypes.js";
import {BookDbModel} from "../validation/bookMongooseSchema.js";


type GroupedByDate = Record<string, string[]>;

export class AccountServiceImplMongo implements AccountService {
    async addAccount(reader: Reader): Promise<void> {
        const temp = await ReaderModel.findById(reader._id)
        if (temp) throw new HttpError(409, "Reader already exists")
        const readerDoc = new ReaderModel(reader)
        await readerDoc.save()
    }

    async changePassword(id: string, newPassword: string): Promise<void> {
        const editReaderPassword = await ReaderModel.findById(id);
        if (!editReaderPassword) throw new HttpError(409, `Reader with id ${id} not found`)
        const isSame = await bcrypt.compare(newPassword, editReaderPassword.passHash);
        if (isSame) {
            throw new HttpError(400, "The new password must not be the same as the old one");
        }
        const newPassHash = await bcrypt.hash(newPassword, 10);
        editReaderPassword.passHash = newPassHash;
        await editReaderPassword.save()
    }


    async changeReaderData(id: string, newUserName: string, newEmail: string, newBirthdate: Date): Promise<void> {
        const editReader = await ReaderModel.findById(id);
        if (!editReader) throw new HttpError(409, `Reader with id ${id} not found`)
        if (newUserName) editReader.userName = newUserName;
        if (newEmail) editReader.email = newEmail;
        if (newBirthdate) editReader.birthdate = newBirthdate;
        await editReader.save()
    }

    async changeReaderRole(id: string, newRole: Roles): Promise<void> {
        const editReader = await ReaderModel.findById(id);
        if (!editReader) throw new HttpError(409, `Reader with id ${id} not found`)
        const currentRoles = editReader.roles || [];
        const updatedRoles = Array.from(new Set([...currentRoles, ...newRole]));
        editReader.roles = updatedRoles;
        await editReader.save()
    }

    async getAccount(id: string): Promise<Reader> {
        const readerById = await ReaderModel.findById(id) as Reader;
        if (!readerById) throw new HttpError(404, `Reader with id ${id} not found`);
        return readerById
    }

    async getAllBooksPikedUpByReader(readerId: string): Promise<{ [pick_date: string]: string[] }>{
        const pickedUpBooks = await BookDbModel.aggregate([
            { $match: { "pickList.readerId": readerId, "pickList.return_date": null } },
            {$group: {
                    _id: '$pickList.pick_date',
                    titles: {$push: '$title'}
                }},
            { $sort: {_id: -1 } },
        ]).exec();
        if (pickedUpBooks.length === 0) {
            throw new HttpError(404, `No active books for reader ${readerId}`);
        }
        const groupedBooks: { [pick_date: string]: string[] } = {};
        for (const g of pickedUpBooks) groupedBooks[g._id] = g.titles;

        return groupedBooks;
    }

    async removeAccount(id: string): Promise<Reader> {
        const deleted = await ReaderModel.findByIdAndDelete(id) as Reader;
        if (!deleted) throw new HttpError(404, `Reader with id ${id} not found`);
        return deleted
    }

}

export const accountServiceImplMongo = new AccountServiceImplMongo()