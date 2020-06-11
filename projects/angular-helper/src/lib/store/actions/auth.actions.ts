import { Action } from '@ngrx/store';
import { AuthUser } from "../../models/auth-user";


export enum AuthActionTypes {
    GET_AUTH_USER = '[AUTH] Get Auth User',
}

export class GetAuthUser implements Action {
    readonly type = AuthActionTypes.GET_AUTH_USER;

    constructor(public payload: AuthUser) {
    }
}


export type AuthActions =
    | GetAuthUser;
