import * as AuthActions from './auth.actions';
import { mockAuthSuccessPayload, testErrorMsg, mockAuthPayloadValues } from './auth-helper';

describe('Auth Actions', () => {
  describe('AuthenticateSuccess', () => {
    it('should create an action', () => {
      const payload = mockAuthSuccessPayload;
      const action = new AuthActions.AuthenticateSuccess(payload);
      expect({ ...action }).toEqual({ type: AuthActions.AUTHENTICATE_SUCCESS, payload });
    });
  });

  describe('AuthenticateFail', () => {
    it('should create an action', () => {
      const payload = testErrorMsg;
      const action = new AuthActions.AuthenticateFail(payload);
      expect({ ...action }).toEqual({ type: AuthActions.AUTHENTICATE_FAIL, payload });
    });
  });

  describe('LoginStart', () => {
    it('should create an action', () => {
      const payload = mockAuthPayloadValues;
      const action = new AuthActions.LoginStart(payload);
      expect({ ...action }).toEqual({ type: AuthActions.LOGIN_START, payload });
    });
  });

  describe('SignupStart', () => {
    it('should create an action', () => {
      const payload = mockAuthPayloadValues;
      const action = new AuthActions.SignupStart(payload);
      expect({ ...action }).toEqual({ type: AuthActions.SIGNUP_START, payload });
    });
  });

  describe('Logout', () => {
    it('should create an action', () => {
      const isAutoLogout = true;
      const action = new AuthActions.Logout(isAutoLogout);
      expect({ ...action }).toEqual({ type: AuthActions.LOGOUT, isAutoLogout });
    });
  });

  describe('AuthenticateFail', () => {
    it('should create an action', () => {
      const payload = testErrorMsg;
      const action = new AuthActions.AuthenticateFail(payload);
      expect({ ...action }).toEqual({ type: AuthActions.AUTHENTICATE_FAIL, payload });
    });
  });

  describe('AutoLogin', () => {
    it('should create an action', () => {
      const action = new AuthActions.AutoLogin();
      expect({ ...action }).toEqual({ type: AuthActions.AUTO_LOGIN });
    });
  });

  describe('ClearError', () => {
    it('should create an action', () => {
      const action = new AuthActions.ClearError();
      expect({ ...action }).toEqual({ type: AuthActions.CLEAR_ERROR });
    });
  });

});
