import { AuthUser } from "../models/auth-user";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { Store } from "@ngrx/store";
import { State } from "../store/reducers";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { first, map, tap } from "rxjs/operators";
import { GetAuthUser } from "../store/actions/auth.actions";

@Injectable({ providedIn: 'root' })
export class AuthUserResolver implements Resolve<AuthUser> {
    constructor(private afa: AngularFireAuth, private store: Store<State>) {
    }


    private getAuthUser(): Observable<AuthUser> {
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

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuthUser> {
        return this.getAuthUser().pipe(
            tap(user => this.store.dispatch(new GetAuthUser(user)))
        )
    }
}
