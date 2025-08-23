import {AccountService} from "../services/accountService.js";
import e, {NextFunction, Request, Response} from "express";
import bcrypt from "bcryptjs";
import {HttpError} from "../errorHandler/HttpError.js";
import {AuthRequest} from "../utils/libTypes.js";

async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response) {
    const BASIC = 'Basic ';
    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
    console.log(auth);
    try {
        const [id, password] = auth.split(":");
        const account = await service.getAccount(id);
        if (bcrypt.compareSync(password, account.passHash)) {
            req.userId = account._id;
            req.userName = account.userName;
            req.roles = account.roles;

            console.log("AUTHENTICATED")
        } else {
            console.log("NOT AUTHENTICATED")
            res.status(401).send('')
        }
    } catch (e) {
        console.log(e)
        res.status(401).send('')
    }
}

export const authentication = (service: AccountService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        console.log(authHeader)
        if (authHeader) await getBasicAuth(authHeader, service, req, res)
        next();
    }
}

export const skipRoutes =(skipRoutes: string[]) =>  (req:AuthRequest, res: Response, next: NextFunction)=> {
    const route = req.method + req.path
    if(!skipRoutes.includes(route) && !req.userId) throw new HttpError(401, '')
    next();
}