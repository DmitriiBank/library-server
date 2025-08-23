
/*
PATCH/accounts/password => Roles.USER,
GET/accounts/reader_id => ROLES.USER, ROLES.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const authorize = (arr: Record<string, Roles[]>)=> (req: AuthRequest, res: Response, next: NewableFunction) => {
    const route = req.method + req.path
    const roles = req.roles
    if(roles?.some(r => arr[route].includes(r)))
        next();
    else throw new HttpError(403, "")
}
