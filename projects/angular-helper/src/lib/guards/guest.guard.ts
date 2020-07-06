import { Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { Store } from "@ngrx/store";
import { State } from "../store/reducers";
import { AuthUser } from "../models/auth-user";
import { first, map, switchMap, tap } from "rxjs/operators";
import { Go } from "../store/actions";

@Injectable({
    providedIn: 'root'
})
export class GuestGuard implements CanActivate, CanActivateChild {
    constructor(private afa: AngularFireAuth, private store: Store<State>) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.activate(next);
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.activate(next);
    }


    private activate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const redirectUrl = route?.data?.redirectPath as Array<string>;
        if (!!redirectUrl) {
            return of(false)
        }
        return this.getAuthUser().pipe(
            tap((user) => {
                if (user) {
                    return this.store.dispatch(new Go({
                        path: redirectUrl
                    }))
                }
            }),
            map(user => Boolean(user) === false)
        )
    }

    private getAuthUser(): Observable<AuthUser | null> {
        return this.store.select(state => state.authReducer?.authUser).pipe(
            first(),
            switchMap(
                (user) => {
                    if (user === undefined) {
                        return this.getFirebaseUser()
                    }

                    return of(null)
                }
            )
        )

    }

    private getFirebaseUser(): Observable<AuthUser> {
        return this.afa.authState.pipe(
            first(),
            map((user) => {
                if (!user) return null;
                const authUser: AuthUser = {
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified
                };

                return authUser;
            })
        );
    }
}
