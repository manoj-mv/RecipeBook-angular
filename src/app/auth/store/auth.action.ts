import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login start';
export const LOGIN = '[Auth] login';
export const LOGIN_FAIL = '[Auth] Login fail';
export const LOGOUT = '[Auth] logout';


export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: { email: string, password: string }) { }
}

export class Login implements Action {
    readonly type = LOGIN;
    constructor(public payload: { email: string, id: string, token: string, tokenExpirationDate: Date }) { }
}

export class LoginFail implements Action {
    readonly type = LOGIN_FAIL;
    constructor(public payload: { error: string }) { }
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export type authActionTypes =
    LoginStart
    | Login
    | LoginFail
    | Logout;