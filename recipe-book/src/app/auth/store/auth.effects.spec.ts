import { TestBed, async } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthEffects } from './auth.effects';
import { AuthService } from '../auth.service';
import { Constants } from 'src/app/shared/constants';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { DUMMY } from 'src/app/shared/utils/dummy-action';
import { AlertRequestInitialiser } from 'src/app/shared/alert/alert-request-initialiser.service';
import * as authHelper from './auth-helper';
import * as AuthActions from './auth.actions';

describe('AuthEffects', () => {
  const { mockAuthResponse } = authHelper;
  const validAuthRequestPayload = authHelper.mockAuthPayloadValues;
  let actions:                    Observable<Action>;
  let effects:                    AuthEffects;
  let baseTimestamp:              number;
  let baseTime:                   Date;
  let router:                     Router;
  let alertRequestInitialiser:    AlertRequestInitialiser;
  let expectedCreateNewAlertArgs: any[];
  let isAutoLogout:               boolean;
  let payload;
  let httpService;
  let authService;

  beforeEach(() => {
    baseTimestamp = 0;
    baseTime = new Date(baseTimestamp);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthEffects,
        provideMockStore(),
        provideMockActions(() => actions),
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['post'])
        }
      ],
    });

    effects = TestBed.get<AuthEffects>(AuthEffects);
    authService = TestBed.get<AuthService>(AuthService);
    httpService = TestBed.get<HttpClient>(HttpClient);
    alertRequestInitialiser = TestBed.get<AlertRequestInitialiser>(AlertRequestInitialiser);
    router = TestBed.get(Router);
    authHelper.setHttpStubReturnValues(httpService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  const _setupAndAssertAuthRequestEffect = (actionType: any, effect: any) => {
    jasmine.clock().install();
    jasmine.clock().mockDate(baseTime);
    payload = validAuthRequestPayload;

    const httpResponsePayload = mockAuthResponse;
    const expectedAuthenticateSuccessPayload = {...authHelper.mockUser, redirect: true};
    expectedAuthenticateSuccessPayload.tokenExpirationDate
      = new Date(baseTimestamp + authHelper.mockTokenExpirationTimestamp * 1000);

    spyOn(authService, 'setLogoutTimer');
    spyOn(localStorage, 'setItem');

    httpService.post.and.returnValue(of(httpResponsePayload));
    actions = of({ type: actionType, payload });

    effect.subscribe(action => {
      expect(authService.setLogoutTimer).toHaveBeenCalledWith(+mockAuthResponse.expiresIn * 1000);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'userData', JSON.stringify(authHelper.expectedAuthSuccessSetLocalStorageUser)
      );
      expect(action.type).toBe(AuthActions.AUTHENTICATE_SUCCESS);
      expect(action.payload).toEqual(expectedAuthenticateSuccessPayload);
    });
  };

  describe('authLogin', () => {
    it(`should dispatch AuthenticateSuccess action
      when LoginStart action is dispatched with valid payload`, () => {
        _setupAndAssertAuthRequestEffect(AuthActions.LOGIN_START, effects.authLogin);
    });

    it(`should dispatch AuthenticateFail action with 'email not found' payload
      when LoginStart action is dispatched`, () => {
      payload = authHelper.mockEmailNotFoundPayload;
      actions = of({ type: AuthActions.LOGIN_START, payload });

      effects.authLogin.subscribe(action => {
        expect(action.type).toBe(AuthActions.AUTHENTICATE_FAIL);
        expect(action.payload).toEqual(Constants.emailNotFoundLabel);
      });
    });

    it(`should dispatch AuthenticateFail action with 'invalid password' payload
      when LoginStart action is dispatched`, () => {
      payload = authHelper.mockInvalidPasswordPayload;
      actions = of({ type: AuthActions.LOGIN_START, payload });

      effects.authLogin.subscribe(action => {
        expect(action.type).toBe(AuthActions.AUTHENTICATE_FAIL);
        expect(action.payload).toEqual(Constants.passwordIncorrectLabel);
      });
    });
  });

  describe('authSignup', () => {
    it(`should dispatch AuthenticateSuccess action,
      when SignupStart action is dispatched with valid payload`, () => {
      _setupAndAssertAuthRequestEffect(AuthActions.SIGNUP_START, effects.authSignup);
    });

    it(`should dispatch AuthenticateFail action with 'email already exists' payload
      when SignupStart action is dispatched with email that already exists`, () => {
      payload = authHelper.mockEmailAlreadyExistsPayload;
      actions = of({ type: AuthActions.SIGNUP_START, payload });

      effects.authSignup.subscribe(action => {
        expect(action.type).toBe(AuthActions.AUTHENTICATE_FAIL);
        expect(action.payload).toEqual(Constants.emailAlreadyExistsLabel);
      });
    });

    it(`should dispatch AuthenticateFail action with 'unknown error' payload
      when SignupStart action is dispatched and returns response without error property`, () => {
      payload = '';
      actions = of({ type: AuthActions.SIGNUP_START, payload });

      effects.authSignup.subscribe(action => {
        expect(action.type).toBe(AuthActions.AUTHENTICATE_FAIL);
        expect(action.payload).toEqual(Constants.unknownErrorMessage);
      });
    });
  });

  describe('authRedirect', () => {
    it(`should navigate to root (['/']), when AuthenticateSuccess action is dispatched
      and 'redirect' is true in payload`, () => {
      spyOn(router, 'navigate');

      payload = authHelper.mockAuthSuccessPayload;
      payload.redirect = true;

      actions = of({ type: AuthActions.AUTHENTICATE_SUCCESS, payload });

      effects.authRedirect.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    it(`should not navigate to root (['/']), when AuthenticateSuccess action is dispatched
      and 'redirect' is false in payload`, () => {
      spyOn(router, 'navigate');

      payload = authHelper.mockAuthSuccessPayload;
      payload.redirect = false;

      actions = of({ type: AuthActions.AUTHENTICATE_SUCCESS, payload });

      effects.authRedirect.subscribe(() => {
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('authFailAlertTrigger', () => {
    it(`should call AlertRequestInitialiser.init() with args from AuthenticateFail action
      and 'danger' enum, when AuthenticateFail action is dispatched`, () => {
      spyOn(alertRequestInitialiser, 'init');

      payload = Constants.passwordIncorrectLabel;
      expectedCreateNewAlertArgs = [payload, Alert.danger];

      actions = of({ type: AuthActions.AUTHENTICATE_FAIL, payload });

      effects.authFailAlertTrigger.subscribe(() => {
        expect(alertRequestInitialiser.init).toHaveBeenCalledTimes(1);
        expect(alertRequestInitialiser.init).toHaveBeenCalledWith(...expectedCreateNewAlertArgs);
      });
    });
  });

  describe('authLogout', () => {
    it(`should call AlertRequestInitialiser.init() with 'token timeout' and 'info' enum args
      , when Logout action is dispatched and 'isAutoLogout' in its payload is true`, () => {
      spyOn(alertRequestInitialiser, 'init');
      spyOn(authService, 'clearLogoutTimer');
      spyOn(localStorage, 'removeItem');
      spyOn(router, 'navigate');
      isAutoLogout = true;
      expectedCreateNewAlertArgs = [Constants.authenticationTokenTimeoutLabel, Alert.info];

      actions = of({ type: AuthActions.LOGOUT, isAutoLogout });

      effects.authLogout.subscribe(() => {
        expect(alertRequestInitialiser.init).toHaveBeenCalledTimes(1);
        expect(alertRequestInitialiser.init).toHaveBeenCalledWith(...expectedCreateNewAlertArgs);
        expect(authService.clearLogoutTimer).toHaveBeenCalledTimes(1);
        expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
        expect(router.navigate).toHaveBeenCalledWith(['/auth']);
      });
    });
  });

  describe('autoLogin', () => {
    it(`should return a Dummy action when AutoLogin action is dispatched
      and userData is falsy `, () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      actions = of({ type: AuthActions.AUTO_LOGIN });

      effects.autoLogin.subscribe((action) => {
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem).toHaveBeenCalledWith('userData');
        expect(action.type).toBe(DUMMY);
      });
    });

    it(`should return a Dummy action when AutoLogin action is dispatched
      and userData's token prop is falsy `, () => {
      const localStorageReturnValue = {...authHelper.mockUser};
      localStorageReturnValue.token = null;
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify(localStorageReturnValue)
      );
      actions = of({ type: AuthActions.AUTO_LOGIN });

      effects.autoLogin.subscribe((action) => {
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem).toHaveBeenCalledWith('userData');
        expect(action.type).toBe(DUMMY);
      });
    });

    it(`should dispatch AuthenticateSuccess with user loaded from localStorage,
      when AutoLogin action is dispatched and userData's token prop is truthy`, () => {
      const localStorageReturnValue = {...authHelper.mockUser};
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify(localStorageReturnValue)
      );
      spyOn(authService, 'setLogoutTimer');
      actions = of({ type: AuthActions.AUTO_LOGIN });

      effects.autoLogin.subscribe((action) => {
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem).toHaveBeenCalledWith('userData');
        expect(authService.setLogoutTimer).toHaveBeenCalledTimes(1);
        expect(action.type).toBe(AuthActions.AUTHENTICATE_SUCCESS);
        expect(JSON.stringify(action.payload)).toEqual(JSON.stringify({ ...authHelper.mockUser, redirect: false }));
      });
    });
  });
});
