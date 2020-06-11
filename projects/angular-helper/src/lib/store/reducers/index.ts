import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Params,
} from '@angular/router';
import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import { RouterReducerState, routerReducer, RouterStateSerializer } from '@ngrx/router-store';
import { authReducer, AuthState } from "./auth.reducer";

export interface RouterStateUrl {
    url: string;
    queryParams: Params;
    params: Params;
}

export interface State {
    routerReducer: RouterReducerState<RouterStateUrl>;
    authReducer: AuthState;
}

export const reducers: ActionReducerMap<State> = {
    routerReducer: routerReducer,
    authReducer: authReducer
};

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('routerReducer');

export class CustomSerializer
    implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        const { url } = routerState;
        const { queryParams } = routerState.root;

        let state: ActivatedRouteSnapshot = routerState.root;
        while (state.firstChild) {
            state = state.firstChild;
        }
        const { params } = state;

        return { url, queryParams, params };
    }
}
