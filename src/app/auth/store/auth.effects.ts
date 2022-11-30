import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, tap, throwError } from "rxjs";
import * as fromApp from "src/app/store/app.reducer";
import { environment } from "src/environments/environment";
import * as authActions from "./auth.action";


export interface AuthApiResponse {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable()
export class AuthEffects {

    @Effect() authLogin = this.actions$.pipe(
        ofType(authActions.LOGIN_START),
        switchMap((authData: authActions.LoginStart) => {
            return this.http.post<AuthApiResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey, {
                ...authData.payload, returnSecureToken: true
            }).pipe(
                map(resp => {
                    console.log(resp);

                    const tokenExpirationDate = new Date(new Date().getTime() + (Number(resp.expiresIn) * 1000));
                    console.log(tokenExpirationDate);

                    return new authActions.Login({ email: resp.email, id: resp.localId, token: resp.idToken, tokenExpirationDate: tokenExpirationDate });
                }),
                catchError(err => {
                    const error: string = this.handleError(err);
                    return of(new authActions.LoginFail({ error: error }));
                })
            );
        })
    );

    @Effect({ dispatch: false }) authSuccess = this.actions$.pipe(
        ofType(authActions.LOGIN),
        tap(() => {
            this.router.navigate(['/recipes']);
        })
    )

    constructor(private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>,
        private router: Router) { }

    private handleError(errorRes: HttpErrorResponse): string {
        let errorMsg = 'An unknown error occured.';
        if (!errorRes.error && !errorRes.error.error) {
            return errorMsg;
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMsg = 'The email address is already in use by another account.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMsg = 'There is no user record corresponding to this email.';
                break;
            case 'INVALID_PASSWORD':
                errorMsg = 'The password is invalid or the user does not have a password.';
                break;
            case 'USER_DISABLED':
                errorMsg = 'The user account has been disabled by an administrator.';
                break;
        }
        return errorMsg;
    }
}