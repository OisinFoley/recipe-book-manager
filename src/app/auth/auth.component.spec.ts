import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MockComponent } from 'ng-mocks';

import { AuthComponent } from './auth.component';
import { setTestProps } from '../shared/utils/test-helpers';
import { mockUnAuthorisedComponentState, mockAuthPayloadValues } from './store/auth-helper';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner/loading-spinner.component';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';

describe('AuthComponent', () => {
  let store:                MockStore<fromApp.AppState>;
  let componentState:       fromApp.AppState;
  let fixture:              ComponentFixture<AuthComponent>;
  let index:                number;
  let component:            AuthComponent;
  let componentHtmlElement: HTMLElement;
  let switchAuthModeBtn:    DebugElement;
  let loadingSpinnerEl:     DebugElement;
  let authSubmitBtn:        DebugElement;
  let passwordInput:        DebugElement;
  let dispatchSpy;
  let validAuthFormValues;

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  beforeEach(() => {
    componentState = mockUnAuthorisedComponentState;
    componentState.auth.loading = false;
    index = 0;
    validAuthFormValues = mockAuthPayloadValues;

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        FormsModule
      ],
      declarations: [
        AuthComponent,
        MockComponent(LoadingSpinnerComponent)
      ],
      providers: [
        provideMockStore({ initialState: { ...componentState } })
      ]
    });
  });

  describe(`When state has 'loading' set to false`, () => {
    beforeEach(
      fakeAsync(() => {
        TestBed.compileComponents();

        ({ store, fixture, component, componentHtmlElement }
          = setTestProps(TestBed, AuthComponent));
        dispatchSpy = spyOn(store, 'dispatch');
        tick();
        fixture.detectChanges();
        switchAuthModeBtn = fixture.debugElement.query(By.css('button#switch-auth-mode-btn'));
        loadingSpinnerEl = fixture.debugElement.query(By.css('app-loading-spinner'));
        authSubmitBtn = fixture.debugElement.query(By.css('button#auth-submit-btn'));
        passwordInput = fixture.debugElement.query(By.css('input#password'));
      })
    );

    it('should create the app', async(() => {
      expect(component).toBeTruthy();
    }));

    it(`should not display LoadingSpinnerComponent`,
      async(() => {
        expect(loadingSpinnerEl).toBeFalsy();
      })
    );

    it(`should set isLoginMode to false when 'Switch to' button is clicked`, async(() => {
      spyOn(component, 'onSwitchMode').and.callThrough();
      switchAuthModeBtn.nativeElement.click();

      expect(component.isLoginMode).toBe(false);
      expect(component.onSwitchMode).toHaveBeenCalledTimes(1);
    }));

    it(`should dispatch 'AuthActions.LoginStart' with payload from form and empty the form's password input,
      when submit button is clicked`, fakeAsync(() => {
        component.authForm.setValue(validAuthFormValues);
        tick();
        fixture.detectChanges();

        expect(passwordInput.nativeElement.value).not.toBeFalsy();
        authSubmitBtn.nativeElement.click();

        expect(passwordInput.nativeElement.value).toBeFalsy();
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new AuthActions.LoginStart(validAuthFormValues)
        );
      })
    );

    it(`should dispatch 'AuthActions.SignupStart' with payload from form and empty the form's password input,
      when submit button is clicked`, fakeAsync(() => {
        switchAuthModeBtn.nativeElement.click();
        component.authForm.setValue(validAuthFormValues);
        tick();
        fixture.detectChanges();
        authSubmitBtn.nativeElement.click();

        expect(passwordInput.nativeElement.value).toBeFalsy();
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new AuthActions.SignupStart(validAuthFormValues)
        );
      })
    );

    it(`should not dispatch anything when submit button is clicked,
      and form is not valid`, async(() => {
        authSubmitBtn.nativeElement.click();
        expect(dispatchSpy).not.toHaveBeenCalled();
      })
    );

    it(`should unsubscribe from storeSub when ngOnDestroy is called`, async(() => {
      const unsubscribeSpy = spyOn(component['storeSub'], 'unsubscribe');
      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe(`When state has 'loading' set to true`, () => {
    beforeEach(
      fakeAsync(() => {
        TestBed.compileComponents();

        ({ store, fixture, component, componentHtmlElement }
          = setTestProps(TestBed, AuthComponent));
        store.setState({
          ...componentState,
          auth: {
            ...componentState.auth,
            loading: true
          }
        });
        dispatchSpy = spyOn(store, 'dispatch');
        tick();
        fixture.detectChanges();
        loadingSpinnerEl = fixture.debugElement.query(By.css('app-loading-spinner'));
      })
    );

    it(`should display LoadingSpinnerComponent and the @Viewchild form member should be undefined`,
      async(() => {
        expect(loadingSpinnerEl).toBeTruthy();
        expect(component.authForm).toBeUndefined();
      })
    );
  });
});
