import express from "express";
import {bodyValidation} from "../validation/bodyValidation.js";
import * as controller from "../controllers/AccountController.js"
import {
    ChangePassDtoSchema,
    ReaderDtoSchema
} from "../validation/bookSchemas.js";

export const accountRouter = express.Router()



accountRouter.post('/', bodyValidation(ReaderDtoSchema), controller.addAccount);
accountRouter.get('/reader', controller.getAccount);
accountRouter.delete('/', controller.removeAccount);
accountRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword)