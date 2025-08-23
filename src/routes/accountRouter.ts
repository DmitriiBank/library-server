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

export const accountRouter = express.Router()


accountRouter.post('/', bodyValidation(ReaderDtoSchema), controller.addAccount);
accountRouter.get('/reader', async (req: AuthRequest, res: Response) => {
    if (req.roles?.includes(Roles.USER)) await controller.getAccount(req, res)
    else throw new HttpError(403, "")
});

accountRouter.delete('/', controller.removeAccount);
accountRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword)
accountRouter.patch('/changes', bodyValidation(ChangeDataDtoSchema), controller.changeReaderData)