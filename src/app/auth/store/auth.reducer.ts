import { User } from "../user.model";
import * as authActions from './auth.action';

export interface AuthState {
    user: User;
    authError: string;
    loading: boolean;
}

export const initialState: AuthState = {
    user: null,
    authError: null,
    loading: false
}

export function authReducer(state: AuthState = initialState, action: authActions.authActionTypes) {
    switch (action.type) {
        case authActions.LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case authActions.LOGIN:
            const payload = action.payload;
            console.log(payload);

            return {
                ...state,
                user: new User(payload.email, payload.id, payload.token, payload.tokenExpirationDate),
                authError: null,
                loading: false
            };
        case authActions.LOGIN_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload.error,
                loading: false
            }
        case authActions.LOGOUT:
            return {
                ...state,
                user: null,
                loading: null
            }
        default:
            return state;
    }
}