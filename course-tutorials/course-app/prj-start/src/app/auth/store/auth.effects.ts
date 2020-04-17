import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

import * as AuthActions from './auth.actions';
import { AuthResponse } from '../interfaces/auth-response';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  @Effect({ dispatch: false })
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START)
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-_x0ng8JNhQzLtg-r88jM3j7OOjo3q8M',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          const tokenExpirationDate = new Date(
            new Date().getTime() + +resData.expiresIn * 1000
          );
          return new AuthActions.AuthenticateSuccess({
            email: resData.email,
            userId: resData.idToken,
            token: resData.idToken,
            tokenExpirationDate
          });
        }),
        catchError (errorResponse => {
          let errorMessage = 'An unknown error occurred';
          // TODO: this is a firebase specific payload and should be updated when moving to Cognito
          if (!errorResponse.error || !errorResponse.error.error) {
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }
          switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email already exists';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'This email does not exist';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'This password is not correct';
              break;
          }
          return of(new AuthActions.AuthenticateFail(errorMessage));
        })
      );
    })
  );
}
