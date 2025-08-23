import {Request, Response} from "express";
import {
    accountServiceImplMongo as service
} from "../services/AccountServiceImplMongo.js";
import {Reader, ReaderDto} from "../model/Reader.js";
import {convertReaderDtoToReader} from "../utils/tools.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const addAccount = async (req: Request, res: Response) => {
    const body = req.body;
    const reader = await convertReaderDtoToReader(body as ReaderDto)
    await service.addAccount(reader as Reader);
    res.status(201).send()
}

export const getAccount = async (req: Request, res: Response) => {
    const {id} = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const result = await service.getAccount(id as string);
    return res.status(200).json(result);
}


export const changePassword = async (req: Request, res: Response) => {
    const {id, newPassword} = req.body;
    if (!id || !newPassword)
        throw new HttpError(400, "Data invalid");
    await service.changePassword(id, newPassword);
    res.status(200).send();

}

export const changeReaderData = async (req: Request, res: Response) => {
    const {id,  newUserName, newEmail, newBirthdate} = req.body;
    if (!id)
        throw new HttpError(400, "Data invalid");
    await service.changeReaderData(id, newUserName, newEmail, newBirthdate);
    res.status(200).send();

}


export const removeAccount = async (req: Request, res: Response) => {
    const {id} = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const result = await service.removeAccount(id as string);
    return res.status(200).json(result);
}