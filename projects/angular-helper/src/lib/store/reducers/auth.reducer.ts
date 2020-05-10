import { AuthUser } from '../../models/auth-user';
import { AuthActions, AuthActionTypes } from "../actions/auth.actions";


export interface AuthState {
    authUser: AuthUser | undefined;
}

// Default data / initial state


export const initialState: AuthState = {

    authUser: undefined
};

export function authReducer(state: AuthState = initialState, action: AuthActions): AuthState {
    switch (action.type) {

        case AuthActionTypes.GET_AUTH_USER: {
            return {
                ...state,
                authUser: action.payload
            };
        }
        default:
            return state;
    }
}
