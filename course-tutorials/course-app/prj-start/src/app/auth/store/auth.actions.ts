import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] LOGIN_START';
export const AUTHENTICATE_SUCCESS = '[Auth] LOGIN';
export const AUTHENTICATE_FAIL = '[Auth] LOGIN_FAIL';
export const SIGNUP_START = '[Auth] SIGNUP_START';
export const LOGOUT = '[Auth] LOGOUT';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      tokenExpirationDate: Date;
    }
  ) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(
    public payload: {
      email: string;
      password: string;
    }
  ) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(
    public payload: {
      email: string;
      password: string;
    }
  ) {}
}

export type AuthActionsType
  = AuthenticateSuccess
  | AuthenticateFail
  | Logout
  | LoginStart
  | SignupStart;
