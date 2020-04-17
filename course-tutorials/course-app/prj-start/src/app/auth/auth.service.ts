import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { User } from './user/user.model';
import { UserData } from '../interfaces/user-data';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';
import { AuthResponse } from './interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  autoLogin() {
    const userData: UserData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    // TODO: can we spread this into the AuthActions.Login function below
    //  instead of declaring the 4 props again just a few lines after doing so on this line?
    const loadedUser = new User(
      userData.email,
      userData.userId,
      userData.token,
      userData.tokenExpirationDate
    );

    if (loadedUser.token) {
      this.store.dispatch(
        new AuthActions.AuthenticateSuccess({ ...loadedUser })
      );
      const expirationDate =
        new Date(userData.tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDate);
    }
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
      const tokenExpirationDate = new Date(
        new Date().getTime() + expiresIn * 1000
      );
      const user = new User(
        email,
        userId,
        token,
        tokenExpirationDate
      );
      this.store.dispatch(
        new AuthActions.AuthenticateSuccess({ ...user })
      );
      // TODO: the expiresIn value uses seconds as its unit, update this if switching auth provider
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
