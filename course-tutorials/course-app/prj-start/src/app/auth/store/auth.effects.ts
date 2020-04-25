import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { Constants } from '../../shared/constants';
import { AuthResponse } from '../interfaces/auth-response';
import { User } from '../user/user.model';
import { UserData } from 'src/app/interfaces/user-data';
import { AuthService } from '../auth.service';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { AlertRequestRelayService } from 'src/app/shared/alert/alert-request-relay.service';

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
  let errorMessage = 'An unknown error occurred';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = Constants.emailAlreadyExistsLabel;
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = Constants.emailNotFoundLabel;
      break;
    case 'INVALID_PASSWORD':
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
    private alertRequestRelayService: AlertRequestRelayService
  ) {}

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponse>(
          Constants.firebaseSignUpUrl,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
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
      this._emitMsgToAlertServiceRelay(authFailAction.payload);
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap((logoutAction: AuthActions.Logout) => {
      if (logoutAction.isAutoLogout) {
        this._fireAutoLogoutAlert();
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
      return this.http
        .post<AuthResponse>(
          Constants.firebaseSignInUrl,
          {
            email: authData.payload.email,
            password: authData.payload.password,
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
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: UserData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY' };
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
      return { type: 'DUMMY' };
    })
  );

  private _fireAutoLogoutAlert = () => {
    this.alertRequestRelayService.relayNewAlertRequest({
      text: Constants.authenticationTokenTimeoutLabel,
      type: Alert.info
    });
  }

  private _emitMsgToAlertServiceRelay = (alertText: string) => {
    this.alertRequestRelayService.relayNewAlertRequest({
      text: alertText,
      type: Alert.danger
    });
  }
}
