import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { catchError, filter, map, of, switchMap, tap, throwError } from "rxjs";
import * as fromApp from "src/app/store/app.reducer";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
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
                    return new authActions.AuthenticateSuccess(this.handleAuthentication(resp));
                }),
                catchError(err => {
                    const error: string = this.handleError(err);
                    return of(new authActions.AuthenticateFail({ error: error }));
                })
            );
        })
    );

    @Effect({ dispatch: false }) authSuccess = this.actions$.pipe(
        ofType(authActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/recipes']);
        })
    );

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(authActions.SIGNUP_START),
        switchMap((actionData: authActions.SignupStart) => {
            console.log(actionData);

            return this.http.post<AuthApiResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey, { ...actionData.payload, returnSecureToken: true })
                .pipe(map(resp => {
                    return new authActions.AuthenticateSuccess(this.handleAuthentication(resp));
                }), catchError(err => {
                    return of(new authActions.AuthenticateFail({ error: this.handleError(err) }));
                }))
        })
    )

    AuthLogout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(authActions.LOGOUT),
            tap(() => {
                localStorage.removeItem('userData');
                this.authService.clearLogoutTimer();
                this.router.navigate(['/auth']);
            })
        )
    }, { dispatch: false });

    AuthAutoLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(authActions.AUTO_LOGIN),
            map(() => {
                console.log('auto login');

                const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));

                if (userData) {
                    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate
                    ));
                    if (loadedUser.token) {
                        const remainingTime = loadedUser.expirationDate.getTime() - new Date().getTime();
                        // this.autoLogout(remainingTime);
                        this.authService.setLogoutTimer(remainingTime);
                        return new authActions.AuthenticateSuccess({ email: loadedUser.email, id: loadedUser.id, token: loadedUser.token, tokenExpirationDate: loadedUser.expirationDate });
                    }
                }
            }),
            filter(Boolean)
        )
    })

    constructor(private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) { }

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

    private handleAuthentication(resp: AuthApiResponse) {
        const tokenExpirationDate = new Date(new Date().getTime() + (Number(resp.expiresIn) * 1000));
        this.authService.setLogoutTimer(Number(resp.expiresIn) * 1000);
        console.log(tokenExpirationDate);
        const user = new User(resp.email, resp.localId, resp.idToken, tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify(user));
        return { email: resp.email, id: resp.localId, token: resp.idToken, tokenExpirationDate: tokenExpirationDate };
    }
}