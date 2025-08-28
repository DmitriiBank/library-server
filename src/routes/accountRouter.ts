import express from "express";
import {bodyValidation} from "../validation/bodyValidation.js";
import * as controller from "../controllers/AccountController.js"
import {
    ChangeDataDtoSchema,
    ChangePassDtoSchema, ChangeRolesSchema,
    ReaderDtoSchema
} from "../validation/bookSchemas.js";

export const accountRouter = express.Router()


accountRouter.post('/', bodyValidation(ReaderDtoSchema), controller.addAccount);
accountRouter.get('/reader', controller.getAccount);

accountRouter.get('/reader/books', controller.getAllBooksPikedUpByReader);

accountRouter.delete('/', controller.removeAccount);

accountRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword)

accountRouter.patch('/changes', bodyValidation(ChangeDataDtoSchema), controller.changeReaderData)

accountRouter.patch('/role', bodyValidation(ChangeRolesSchema), controller.changeReaderRole)

