import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private afa: AngularFireAuth) {
    }

    login(email: string, password: string) {
        return this.afa.signInWithEmailAndPassword(email, password);
    }

    async registration(email: string, password: string) {
        await this.afa.createUserWithEmailAndPassword(email, password);
    }


    logout() {
        return this.afa.signOut();
    }

    getAuthUser(): Observable<firebase.User | null> {
        return this?.afa?.authState;
    }

    isLoggedIn(): Observable<boolean> {
        return this.afa.user.pipe(
            switchMap(user => of(user !== null))
        );
    }

    isLoggedOut(): Observable<boolean> {
        return this.afa.user.pipe(
            switchMap(user => of(user === null))
        );
    }

    getFirebaseToken(): Observable<string | null> {
        return this.getAuthUser().pipe(
            switchMap(authUser => {
                if (authUser !== null) {
                    return new Observable(subscriber => {
                        authUser.getIdTokenResult().then(token => {
                            subscriber.next(token.token);
                            subscriber.complete();
                        }).catch(err => subscriber.error(err));
                    });
                }

                return of(null);
            })
        );
    }

}
