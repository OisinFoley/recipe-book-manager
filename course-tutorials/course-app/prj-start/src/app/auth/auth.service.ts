import { Injectable } from '@angular/core';

import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user/user.model';
import { Router } from '@angular/router';
import { UserData } from '../interfaces/user-data';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA-_x0ng8JNhQzLtg-r88jM3j7OOjo3q8M',
      {
        email,
        password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(resData => {
      // TODO: these props are firebase-specific and need updating when switching auth handler
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        );
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-_x0ng8JNhQzLtg-r88jM3j7OOjo3q8M',
      {
        email,
        password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        // TODO: these props are firebase-specific and need updating when switching auth handler
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        );
      })
    );
  }

  autoLogin() {
    const userData: UserData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData._id, userData._token, userData._tokenExpirationDate);

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDate =
        new Date(userData._tokenExpirationDate).getTime() -
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
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
      const user = new User(
        email,
        userId,
        token,
        expirationDate
      );
      this.user.next(user);
      // TODO: the expiresIn value uses seconds as its unit, update this if switching auth provider
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    // TODO: this is a firebase specific payload and should be updated when moving to Cognito
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }

  logout() {
    this.user.next(null);
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

  // public owner: string;
  // public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // private cognitoUser: CognitoUser;

  // constructor() {
  //   this.isAuthenticatedSubject.next(this.isAuthenticated());
  // }

  // private userPool: CognitoUserPool = new CognitoUserPool({
  //   // UserPoolId: environment.userPoolId,
  //   // ClientId: environment.clientId,

  //   // TODO: replace with params froman env file
  //   UserPoolId: 'eu-west-1_35UEbEyJA',
  //   ClientId: '4f40ei3s01fh8ciupom9aeiu3f',
  // });

  // isAuthenticated(): boolean {
  //   const cognitoUser = this.userPool.getCurrentUser();
  //   if (cognitoUser == null) {
  //     return false;
  //   }
  //   return cognitoUser.getSession((err, session) => {
  //     this.owner = session.accessToken.payload.username.toUpperCase();
  //     return err ? false : true;
  //   });
  // }

  // register() {
  //   const attributeList = [];
  //   const attributeEmail = new CognitoUserAttribute({
  //     Name : 'email',
  //     Value : 'oisinfoley@yahoo.co.uk'
  //   });
  //   attributeList.push(attributeEmail);

  //   // let userPool = new CognitoUserPool(poolData);
  //   this.userPool.signUp('oisin', 'Boards.ie09', attributeList, null, (err, result) => {
  //     if (err) {
  //       alert(err.message || JSON.stringify(err));
  //       return;
  //     }
  //     this.cognitoUser = result.user;
  //     console.log('user name is ' + this.cognitoUser.getUsername());
  //     // change elements of page
  //     // document.getElementById("titleheader").innerHTML = "Check your email for a verification link";
  //   });
  // }

  // login(username: string = 'oisinfoley@yahoo.co.uk', password: string = 'W!shiwa$secure55'): Observable<any> {
  //   const self = this;
  //   const cognitoUser = new CognitoUser({
  //     Username: username,
  //     Pool: this.userPool,
  //   });
  //   const details = new AuthenticationDetails({
  //     Username: username,
  //     Password: password,
  //   });
  //   password = null;
  //   return new Observable(observer => {
  //     cognitoUser.authenticateUser(details, {
  //       onSuccess: (session: any) => {
  //         this.owner = session.accessToken.payload.username.toUpperCase();
  //         this.isAuthenticatedSubject.next(true);
  //         observer.next('login');
  //       },
  //       onFailure: err => {
  //         observer.error(err);
  //       },
  //       newPasswordRequired: function() {
  //         self.cognitoUser = cognitoUser;
  //         observer.next('reset');
  //       }
  //     });
  //   });
  // }
}
