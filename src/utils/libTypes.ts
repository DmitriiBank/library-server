import e from "express";

export interface AuthRequest extends e.Request{
    userId?: string,
    userName?: string,
    roles?: Roles[]
}

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
    SUPERVISOR = 'supervisor',
    READER = 'reader'
}