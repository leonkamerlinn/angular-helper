import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthUser } from "../models/auth-user";
import { first, map, switchMap, tap } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
import { Store } from "@ngrx/store";
import { State } from "../store/reducers";
import { GetAuthUser } from "../store/actions/auth.actions";

@Injectable({
    providedIn: 'root'
})
export class AuthUserPreloadGuard implements CanActivate, CanActivateChild {
    constructor(private afa: AngularFireAuth, private store: Store<State>) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.activate();
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.activate();
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


    private activate(): Observable<boolean> {
        return this.getAuthUser().pipe(
            tap(user => this.store.dispatch(new GetAuthUser(user))),
            map(user => true)
        )
    }
}
