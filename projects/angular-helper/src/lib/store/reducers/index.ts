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
    routerState: RouterReducerState<RouterStateUrl>;
    authState: AuthState;
}

export const reducers: ActionReducerMap<State> = {
    routerState: routerReducer,
    authState: authReducer
};

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('routerState');

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
