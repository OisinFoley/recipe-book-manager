import { TestBed, tick, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { State as RecipeListState } from '../store/recipe.reducer';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { getRecipeSeedData } from '../store/recipe-helper';
import { RecipeListComponent } from './recipe-list.component';
import { mockDefaultAppState, setTestProps } from 'src/app/shared/utils/test-helpers';
import * as fromApp from 'src/app/store/app.reducer';

describe('RecipeListComponent', () => {
  let store:                MockStore<fromApp.AppState>;
  let fixture:              ComponentFixture<RecipeListComponent>;
  let component:            RecipeListComponent;
  let componentHtmlElement: HTMLElement;
  let router:               Router;
  let routerNavigateSpy;

  const seedData = getRecipeSeedData();
  const populatedRecipeListState: RecipeListState = {
    recipes: seedData,
    loading: false
  };
  const componentState: fromApp.AppState = {
    ...mockDefaultAppState,
    recipes: {...populatedRecipeListState}
  };

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  beforeEach(
    fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          CommonModule,
          BrowserAnimationsModule
        ],
        declarations: [
          RecipeListComponent,
          MockComponent(RecipeItemComponent)
        ],
        providers: [
          provideMockStore({ initialState: { ...componentState } }),
        ]
      });
      TestBed.compileComponents();

      ({ store, router, fixture, component, componentHtmlElement }
        = setTestProps(TestBed, RecipeListComponent));
      routerNavigateSpy = spyOn(router, 'navigate');
      fixture.detectChanges();
    })
  );

  it('should create the app', fakeAsync(() => {
      expect(component).toBeTruthy();
  }));

  it('should display a number of RecipeItem child components equivalent to the amount of recipes passed to the state',
    fakeAsync(() => {
      const debugElements = fixture.debugElement.queryAll(By.css('app-recipe-item'));

      expect(debugElements.length).toBeGreaterThan(1);
      expect(debugElements.length).toBe(seedData.length);
    })
  );

  it('should navigate when new recipe button is clicked', fakeAsync(() => {
      const routeExtras: any = { relativeTo: component['route'] };
      const debugElement = fixture.debugElement.query(By.css('button#new-recipe-btn'));
      debugElement.nativeElement.click();

      expect(routerNavigateSpy).toHaveBeenCalledWith(['new'], routeExtras);
  }));

  it(`should unsubscribe when ngOnDestroy is called`, fakeAsync(() => {
    const unsubscribeSpy = spyOn(component['_subscription'], 'unsubscribe');
    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  }));

  it(`should set disableListFadeOut member to true, when recipeState is loading`,
    fakeAsync(() => {
      fixture.whenStable().then(() => {
        store.setState({
          ...mockDefaultAppState,
          recipes: {
            ...populatedRecipeListState,
            loading: true
          }
        });
      });
      tick();
      fixture.detectChanges();

      expect(component['disableListFadeOut']).toEqual(true);
    })
  );
});
