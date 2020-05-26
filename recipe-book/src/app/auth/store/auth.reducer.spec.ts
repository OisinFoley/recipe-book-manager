import * as fromAuth from './auth.reducer';
import * as AuthActions from './auth.actions';
import { mockUser, mockAuthorisedState, testErrorMsg, mockAuthPayloadValues } from './auth-helper';

let initialState: fromAuth.State;

describe('Auth Reducer', () => {
  describe('AUTHENTICATE_SUCCESS', () => {
    it('should set user matching values passed in payload', () => {
      initialState = {
        ...fromAuth.initialState,
      };
      const payload = {...mockUser, redirect: true};
      const action = new AuthActions.AuthenticateSuccess(payload);
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(mockAuthorisedState);
    });
  });

  describe('AUTHENTICATE_FAIL', () => {
    it('should set error to value passed in payload', () => {
      initialState = {...fromAuth.initialState};
      const payload = testErrorMsg;
      const action = new AuthActions.AuthenticateFail(payload);
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual({...initialState, authError: payload });
    });
  });

  describe('LOGIN_START', () => {
    it(`should set 'loading' to true and 'authError' to falsy string`, () => {
      initialState = {...fromAuth.initialState};
      const action = new AuthActions.LoginStart(mockAuthPayloadValues);
      const state = fromAuth.authReducer(initialState, action);

      expect(state.loading).toEqual(true);
      expect(state.authError).toBeFalsy();
    });
  });

  describe('SIGNUP_START', () => {
    it(`should set 'loading' to true and 'authError' to falsy string`, () => {
      initialState = {...fromAuth.initialState};
      const action = new AuthActions.SignupStart(mockAuthPayloadValues);
      const state = fromAuth.authReducer(initialState, action);

      expect(state.loading).toEqual(true);
      expect(state.authError).toBeFalsy();
    });
  });

  describe('LOGOUT', () => {
    it(`should set 'user' to null`, () => {
      initialState = mockAuthorisedState;
      const action = new AuthActions.Logout();
      const state = fromAuth.authReducer(initialState, action);

      expect(state.user).toEqual(null);
    });
  });

  describe('CLEAR_ERROR', () => {
    it(`should set 'authError' to falsy string`, () => {
      initialState = {...fromAuth.initialState, authError: testErrorMsg };
      const action = new AuthActions.ClearError();
      const state = fromAuth.authReducer(initialState, action);

      expect(state.authError).toBeFalsy();
    });
  });
});
