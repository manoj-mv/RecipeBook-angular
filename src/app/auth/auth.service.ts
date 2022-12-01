import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as authActions from './store/auth.action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer = null;

  constructor(private store: Store<AppState>) { }


  setLogoutTimer(expirationDuaration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new authActions.Logout());
    }, expirationDuaration);
  }

  clearLogoutTimer() {
    clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }
}
