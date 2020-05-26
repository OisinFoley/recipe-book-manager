import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _tokenExpirationTimer: NodeJS.Timeout;
  get tokenExpirationTimer(): NodeJS.Timeout {
    return this._tokenExpirationTimer;
  }
  set tokenExpirationTimer(e: NodeJS.Timeout) {
    this._tokenExpirationTimer = e;
  }

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout(true));
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
