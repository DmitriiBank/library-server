
/*
PATCH/accounts/password => Roles.USER,
GET/accounts/reader_id => ROLES.USER, ROLES.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {NextFunction, Request, Response} from "express";
import {pool} from "../config/libConfig.js";

async function checkPermission(route: string, role: Roles[]) {
    const [rows] = await pool.query(
        `SELECT 1 FROM route_permissions WHERE route=? AND role=? LIMIT 1`,
        [route, role]
    );
    return (rows as any[]).length > 0;
}

export const authorize = ()=> async (req: AuthRequest, res: Response, next: NextFunction) => {
    const route = req.method + req.path
    const roles = req.roles as Roles[]
    if (await checkPermission(route, roles)){
        console.log("Access access")
        next();
    }
    else {
        console.log("Access denied")
        throw new HttpError(403, "")
    }
}
