import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Back, Forward, Go, RouterActionTypes } from '../actions/router.action';

import { map, tap } from 'rxjs/operators';

@Injectable()
export class RouterEffects {
    constructor(
        private actions$: Actions,
        private router: Router,
        private location: Location
    ) {
    }
Ø

    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType<Go>(RouterActionTypes.GO),
        map(action => action.payload),
        tap(async ({ path, query: queryParams, extras }) => {
            await this.router.navigate(path, { queryParams, ...extras });
        })
    );

    @Effect({ dispatch: false })
    navigateBack$ = this.actions$.pipe(
        ofType<Back>(RouterActionTypes.BACK),
        tap(async () => {
            await this.location.back();
        })
    );

    @Effect({ dispatch: false })
    navigateForward$ = this.actions$.pipe(
        ofType<Forward>(RouterActionTypes.FORWARD),
        tap(async () => {
            await this.location.forward();
        })
    );

}
