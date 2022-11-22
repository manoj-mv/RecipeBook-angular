import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthApiResponse {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject$ = new BehaviorSubject<User>(null);
  private tokenExpirationTimer = null;

  constructor(private http: HttpClient, private router: Router) { }

  get userSubject() {
    return this.userSubject$;
  }

  signup(signupData: { email: string, password: string }) {
    return this.http.post<AuthApiResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey, { ...signupData, returnSecureToken: true })
      .pipe(
        tap(resp => this.handleAuthentication(resp)),
        catchError(this.handleError)
      )
  }

  login(loginData: { email: string, password: string }) {
    return this.http.post<AuthApiResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey, {
      ...loginData, returnSecureToken: true
    }).pipe(
      tap(resp => this.handleAuthentication(resp)),
      catchError(this.handleError)
    );
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate
      ));
      if (loadedUser.token) {
        const remainingTime = loadedUser.expirationDate.getTime() - new Date().getTime();
        this.autoLogout(remainingTime);
        return this.userSubject.next(loadedUser);
      }
    } else {
      return;
    }
  }

  autoLogout(expirationDuaration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuaration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An unknown error occured.';
    if (!errorRes.error && !errorRes.error.error) {
      return throwError(() => new Error(errorMsg));
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
    return throwError(() => new Error(errorMsg));
  }

  private handleAuthentication(data: AuthApiResponse) {
    const tokenExpirationDate = new Date(new Date().getTime() + (Number(data.expiresIn) * 1000));
    console.log('testData', tokenExpirationDate);
    const user = new User(data.email, data.localId, data.idToken, tokenExpirationDate);
    console.log(user);
    this.userSubject.next(user);
    this.autoLogout(Number(data.expiresIn) * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
