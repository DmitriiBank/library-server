
/*
PATCH/accounts/password => Roles.USER,
GET/accounts/reader_id => ROLES.USER, ROLES.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {NextFunction, Request, Response} from "express";
import {pool} from "../config/libConfig.js";
import * as controller from "../controllers/AccountController.js";

async function checkPermission(route: string, role: Roles[]) {
    if (!role || role.length === 0) return false;

    const placeholders = role.map(() => "?").join(",");
    const sql = `
    SELECT 1
    FROM route_permissions
    WHERE route = ? AND role IN (${placeholders})
    LIMIT 1
  `;

    const params = [route, ...role];
    const [rows] = await pool.query(sql, params);
    return (rows as any[]).length > 0;
}

export const authorize = ()=> async (req: AuthRequest, res: Response, next: NextFunction) => {
    const route = req.method + req.path
    const roles = req.roles as Roles[]
    if (!roles || await checkPermission(route, roles)){
        console.log("Access granted")
        next();
    }
    else {
        console.log("Access denied")
        throw new HttpError(403, "")
    }
}


export const checkAccountById = () => {
return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const route = req.method + req.path;
    const roles = req.roles;
    if (!roles || await checkPermission(route, roles) ||
        !req.roles!.includes(Roles.ADMIN) && req.userId == req.query.id)
        next();
    else throw new HttpError(403, "You can modify only your account")

}
}