import express, {Response} from "express";
import {bodyValidation} from "../validation/bodyValidation.js";
import * as controller from "../controllers/AccountController.js"
import {
    ChangeDataDtoSchema,
    ChangePassDtoSchema,
    ReaderDtoSchema
} from "../validation/bookSchemas.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {authorize} from "../middleware/authorization.js";

export const accountRouter = express.Router()


accountRouter.post('/', bodyValidation(ReaderDtoSchema), controller.addAccount);
accountRouter.get('/reader', async (req: AuthRequest, res: Response) => {
    if (req.roles?.includes(Roles.USER)) await controller.getAccount(req, res)
    else throw new HttpError(403, "")
});

accountRouter.delete('/', async (req: AuthRequest, res: Response) => {
    if (req.roles?.includes(Roles.USER || Roles.ADMIN)) await controller.removeAccount(req, res)
    else throw new HttpError(403, "")
});

accountRouter.patch('/password', async (req: AuthRequest, res: Response) => {
    bodyValidation(ChangePassDtoSchema)
    if (req.roles?.includes(Roles.USER)) await controller.changePassword(req,res)
    else throw new HttpError(403, "")
})

accountRouter.patch('/changes', async (req: AuthRequest, res: Response) => {
    bodyValidation(ChangeDataDtoSchema)
    if (req.roles?.includes(Roles.USER)) await controller.changeReaderData(req, res)
    else throw new HttpError(403, "")
})

accountRouter.patch('/role', async (req: AuthRequest, res: Response) => {
    bodyValidation(ChangeDataDtoSchema)
    if (req.roles?.includes(Roles.ADMIN)) await controller.changeReaderRole(req, res)
    else throw new HttpError(403, "")
})

