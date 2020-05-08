import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';

import { HeaderComponent } from './header.component';
import { Constants } from 'src/app/shared/constants';
import { mockUnAuthorisedComponentState, mockAuthorisedComponentState } from '../auth/store/auth-helper';
import { setTestProps } from '../shared/utils/test-helpers';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

describe('HeaderComponent', () => {
  let store:                MockStore<fromApp.AppState>;
  let componentState:       fromApp.AppState;
  let fixture:              ComponentFixture<HeaderComponent>;
  let component:            HeaderComponent;
  let anchorElements:       DebugElement[];
  let anchorElement:        DebugElement;
  let componentHtmlElement: HTMLElement;
  let recipesRouterLinkIndex;
  let authRouterLinkIndex;
  let dispatchSpy;

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  beforeEach(() => {
    componentState = mockUnAuthorisedComponentState;
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        CommonModule
      ],
      declarations: [HeaderComponent],
      providers: [
        provideMockStore({ initialState: { ...componentState } })
      ]
    });
  });

  describe('When user is not authenticated', () => {
    beforeEach(() => {
      TestBed.compileComponents();
      ({ store, fixture, component, componentHtmlElement }
        = setTestProps(TestBed, HeaderComponent));
      dispatchSpy = spyOn(store, 'dispatch');
      fixture.detectChanges();
    });

    it('should create the app', async(() => {
      expect(component).toBeTruthy();
    }));

    it('should render "/auth" routerlink', async(() => {
      anchorElements = fixture.debugElement.queryAll(By.css('a'));
      authRouterLinkIndex = anchorElements.findIndex(de => {
        return de.properties['href'] === '/auth';
      });
      recipesRouterLinkIndex = anchorElements.findIndex(de => {
        return de.properties['href'] === '/recipes';
      });

      expect(authRouterLinkIndex).toBeGreaterThan(-1, '/auth routerlink does not exist');
      expect(recipesRouterLinkIndex).toBe(-1);
    }));

    it('should show "/auth" navigation link and its accompanying text', async(() => {
        anchorElement = fixture.debugElement.query(By.css('a[href*="/auth"]'));
        expect(anchorElement.nativeElement.textContent).toEqual(Constants.authenticateLabel);
      })
    );
  });

  describe('When user is authenticated', () => {
    beforeEach(() => {
      TestBed.compileComponents();
      ({ store, fixture, component, componentHtmlElement }
        = setTestProps(TestBed, HeaderComponent));
      store.setState({
        ...mockAuthorisedComponentState
      });
      dispatchSpy = spyOn(store, 'dispatch');
      fixture.detectChanges();
    });

    it('should render "/recipes" routerlink', async(() => {
      anchorElements = fixture.debugElement.queryAll(By.css('a'));
      recipesRouterLinkIndex = anchorElements.findIndex(de => {
        return de.properties['href'] === '/recipes';
      });
      authRouterLinkIndex = anchorElements.findIndex(de => {
        return de.properties['href'] === '/auth';
      });

      expect(recipesRouterLinkIndex).toBeGreaterThan(-1, '/recipes routerlink does not exists');
      expect(authRouterLinkIndex).toBe(-1);
    }));

    it(`should dispatch "StoreRecipes" action when ${Constants.saveRecipesLabel} button is clicked`,
      async(() => {
        anchorElement = fixture.debugElement.query(By.css('a#save-recipes-btn'));
        anchorElement.nativeElement.click();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new RecipeActions.StoreRecipes()
        );
      })
    );

    it(`should dispatch "Loading" and "StoreRecipes" actions when ${Constants.fetchRecipesLabel} button is clicked`,
      async(() => {
        anchorElement = fixture.debugElement.query(By.css('a#fetch-recipes-btn'));
        anchorElement.nativeElement.click();
        const allCalls = dispatchSpy.calls.all();
        const firstCall = allCalls[0].args;
        const secondCall = allCalls[1].args;

        expect(dispatchSpy).toHaveBeenCalledTimes(2);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new RecipeActions.FetchRecipes()
        );
        expect(dispatchSpy).toHaveBeenCalledWith(
          new RecipeActions.Loading()
        );
        expect(firstCall).toEqual([new RecipeActions.Loading()]);
        expect(secondCall).toEqual([new RecipeActions.FetchRecipes()]);
      })
    );

    it(`should dispatch "Logout" action when ${Constants.logoutLabel} button is clicked`,
      async(() => {
        anchorElement = fixture.debugElement.query(By.css('a#logout-btn'));
        anchorElement.nativeElement.click();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new AuthActions.Logout()
        );
      })
    );

    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = spyOn(component['userSub'], 'unsubscribe');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
