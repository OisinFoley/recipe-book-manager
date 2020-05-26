import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of, Observable } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { setTestProps } from 'src/app/shared/utils/test-helpers';
import { mockRecipeComponentState } from '../store/recipe-helper';
import { RecipeDetailComponent } from './recipe-detail.component';
import * as fromRecipes from 'src/app/recipes/store/recipe.reducer';
import * as fromApp from 'src/app/store/app.reducer';
import * as RecipeActions from 'src/app/recipes/store/recipe.actions';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions';

describe('RecipeDetailComponent', () => {
  let store:                MockStore<fromApp.AppState>;
  let componentState:       fromApp.AppState;
  let fixture:              ComponentFixture<RecipeDetailComponent>;
  let router:               Router;
  let index:                number;
  let component:            RecipeDetailComponent;
  let componentHtmlElement: HTMLElement;
  let dispatchSpy;
  let routerSpy;

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  beforeEach(() => {
    componentState = mockRecipeComponentState;
    index = 0;

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule
      ],
      declarations: [RecipeDetailComponent],
      providers: [
        provideMockStore({ initialState: { ...componentState } }),
        { provide: ActivatedRoute, useValue: { 'params': from([{ 'id': index }]) } }
      ]
    });
  });

  describe(`When 'id' in route params matches the id of an existing recipe,
  and recipe has populated ingredients list`, () => {
    beforeEach(() => {
      TestBed.compileComponents();

      ({ store, router, fixture, component, componentHtmlElement }
        = setTestProps(TestBed, RecipeDetailComponent));
      fixture.detectChanges();
      routerSpy   = spyOn(router, 'navigate');
      dispatchSpy = spyOn(store, 'dispatch');
    });

    it('should create the app', async(() => {
      expect(component).toBeTruthy();
    }));

    it(`should return 'false' when 'isDisabled()' is called with a recipe
      which has a non-empty ingredient list `, async(() => {
        expect(component.isDisabled(component.recipe)).toBe(false);
    }));

    it(`should navigate to 'edit', relative to this.route when 'editRecipe' anchor is clicked`,
      async(() => {
      const editAnchor: DebugElement = fixture.debugElement.query(By.css('a#edit-recipe-anchor'));
      const routeExtras: any = { relativeTo: component['route'] };
      editAnchor.nativeElement.click();

      expect(routerSpy).toHaveBeenCalledWith(['edit'], routeExtras);
    }));

    it(`should dispatch 'ShoppingListActions.AddIngredients' with the recipe's ingredients as payload,
      when addToShoppingList anchor is clicked and the recipe has a non-empty ingredient list`,
      async(() => {
      const toShoppingListAnchor: DebugElement
        = fixture.debugElement.query(By.css('a#add-to-shopping-list-anchor'));
      toShoppingListAnchor.nativeElement.click();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new ShoppingListActions.AddIngredients(component.recipe.ingredients)
      );
    }));

    it(`should dispatch 'RecipeActions.DeleteRecipe' with the recipe's id as payload
      and navigate to 'recipes' when deleteRecipe anchor is clicked`, async(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      const deleteRecipeAnchor: DebugElement = fixture.debugElement.query(By.css('a#delete-recipe-anchor'));
      fixture.detectChanges();
      deleteRecipeAnchor.nativeElement.click();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new RecipeActions.DeleteRecipe(component.id)
      );
      expect(routerSpy).toHaveBeenCalledWith(['/recipes']);
    }));
  });

  describe(`When 'id' in route params matches the id of an existing recipe,
    and recipe has empty ingredients list`, () => {
      beforeEach(() => {
        TestBed.overrideProvider(
          ActivatedRoute,
          { useValue: { 'params': from([{ 'id': index + 1 }]) }}
        );
        TestBed.compileComponents();
        ({ store, router, fixture, component, componentHtmlElement }
          = setTestProps(TestBed, RecipeDetailComponent));
        dispatchSpy = spyOn(store, 'dispatch');
      });

      it(`should return 'true' when 'isDisabled()' is called with a recipe
        which has an empty ingredient list `, async(() => {
          expect(component.isDisabled(component.recipe)).toBe(true);
      }));

      it(`should not dispatch 'ShoppingListActions.AddIngredients' when addToShoppingList anchor is clicked
        and the recipe has an empty ingredient list`,
        async(() => {
        const toShoppingListAnchor: DebugElement
          = fixture.debugElement.query(By.css('a#add-to-shopping-list-anchor'));
        fixture.detectChanges();
        toShoppingListAnchor.nativeElement.click();

        expect(toShoppingListAnchor.nativeElement)
          .toHaveClass('disabled', 'toShoppingList anchor is not enabled when it should be disabled');
        expect(dispatchSpy).not.toHaveBeenCalled();
      }));
  });

  describe(`When 'id' in route params does not match the id of any existing recipes `, () => {
    let customMockRouter;
    let customMockRoute;
    let customMockStore;
    beforeEach(() => {
      index = 9999;
    });

    it(`should redirect the route to '/recipes'`, async(() => {
      customMockStore = {
        select: (stateKey: string): Observable<fromRecipes.State> => {
          return of(componentState.recipes);
        }
      };
      customMockRouter = {
        routeReuseStrategy : {},
        navigate: (commands: any[]): Promise<boolean> => {
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        }
      };
      customMockRoute = {
        params: of({
          id: 11
        })
      };
      spyOn(customMockRouter, 'navigate');
      const c = new RecipeDetailComponent(
        <any>customMockRouter,
        <any>customMockRoute,
        <any>customMockStore
      );

      expect(customMockRouter.navigate).toHaveBeenCalledWith(['/recipes']);
    }));
  });
});
