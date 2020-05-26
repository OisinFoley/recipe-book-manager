import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { Constants } from 'src/app/shared/constants';
import { AuthResponse } from '../interfaces/auth-response';
import { User } from '../models/user.model';
import { UserData } from 'src/app/auth/interfaces/user-data';
import { AuthService } from '../auth.service';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { DummyAction } from 'src/app/shared/utils/dummy-action';
import { AlertRequestInitialiser } from 'src/app/shared/alert/alert-request-initialiser.service';
import { AuthRequest } from '../interfaces/auth-request';

const {
  emailAlreadyExists,
  emailNotFound,
  invalidPassword
} = Constants.firebaseAuthErrors;

const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
  ) => {
  const tokenExpirationDate = new Date(
    new Date().getTime() + expiresIn * 1000
  );
  const user = new User(email, userId, token, tokenExpirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    tokenExpirationDate,
    redirect: true
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = Constants.unknownErrorMessage;
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case emailAlreadyExists:
      errorMessage = Constants.emailAlreadyExistsLabel;
      break;
    case emailNotFound:
      errorMessage = Constants.emailNotFoundLabel;
      break;
    case invalidPassword:
      errorMessage = Constants.passwordIncorrectLabel;
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private alertRequestInitialiser: AlertRequestInitialiser
  ) {}

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      const payload: AuthRequest = {
        email: signupAction.payload.email,
        password: signupAction.payload.password
      };
      return this._handleAuthRequest(Constants.firebaseSignUpUrl, payload);
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({ dispatch: false })
  authFailAlertTrigger = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_FAIL),
    tap((authFailAction: AuthActions.AuthenticateFail) => {
      this.alertRequestInitialiser.init(authFailAction.payload, Alert.danger);
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap((logoutAction: AuthActions.Logout) => {
      if (logoutAction.isAutoLogout) {
        this.alertRequestInitialiser.init(
          Constants.authenticationTokenTimeoutLabel, Alert.info);
      }
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const payload: AuthRequest = {
        email: authData.payload.email,
        password: authData.payload.password
      };
      return this._handleAuthRequest(Constants.firebaseSignInUrl, payload);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: UserData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return new DummyAction();
      }

      const loadedUser = new User(
        userData.email,
        userData.userId,
        userData.token,
        userData.tokenExpirationDate
      );

      if (loadedUser.token) {
        const expirationDate =
          new Date(userData.tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDate);

        return new AuthActions.AuthenticateSuccess({ ...loadedUser, redirect: false });
      }
      return new DummyAction();
    })
  );

  private _handleAuthRequest(url: string, authAction: AuthRequest) {
    return this.http
    .post<AuthResponse>(
      url,
      {
        email: authAction.email,
        password: authAction.password,
        returnSecureToken: true
      }
    ).pipe(
      tap(resData => {
        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
      }),
      map(resData => {
        return handleAuthentication(
          +resData.expiresIn,
          resData.email,
          resData.localId,
          resData.idToken
        );
      }),
      catchError(errorResponse => {
        return handleError(errorResponse);
      })
    );
  }
}
