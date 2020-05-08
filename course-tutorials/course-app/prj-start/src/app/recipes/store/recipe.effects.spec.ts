
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';

import { State } from '../store/recipe.reducer';
import { RecipeEffects } from './recipe.effects';
import { mockRecipeData, getRecipeSeedData } from './recipe-helper';
import { mockDefaultAppState } from 'src/app/shared/utils/test-helpers';
import { AlertRequestInitialiser } from 'src/app/shared/alert/alert-request-initialiser.service';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { Constants } from 'src/app/shared/constants';
import * as RecipeActions from './recipe.actions';
import * as fromApp from 'src/app/store/app.reducer';

describe('RecipeEffects', () => {
  let actions:                    Observable<Action>;
  let effects:                    RecipeEffects;
  let alertRequestInitialiser:    AlertRequestInitialiser;
  let expectedCreateNewAlertArgs: any[];
  let httpService;

  beforeEach(async(() => {
    const seedData = getRecipeSeedData();
    const recipeState: State = {
      recipes: seedData,
      loading: false
    };
    const appState: fromApp.AppState = {
      ...mockDefaultAppState,
      recipes: {...recipeState}
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        RecipeEffects,
        provideMockStore({ initialState: { ...appState } }),
        provideMockActions(() => actions),
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['get', 'put'])
        }
      ],
    });

    effects = TestBed.get<RecipeEffects>(RecipeEffects);
    httpService = TestBed.get<HttpClient>(HttpClient);
    alertRequestInitialiser = TestBed.get<AlertRequestInitialiser>(AlertRequestInitialiser);
  }));

  describe('fetchRecipes', () => {
    it(`should dispatch SetRecipes action with an empty array when FetchRecipes
      is dispatched and http get request returns empty response`, () => {
        httpService.get.and.returnValue(of(null));
        actions = of({ type: RecipeActions.FETCH_RECIPES });

        effects.fetchRecipes.subscribe(action => {
          expect(action.type).toBe(RecipeActions.SET_RECIPES);
          expect(action.payload).toEqual([]);
        });
    });

    it(`should dispatch SetRecipes action with mockRecipeData
      when http get request returns mockRecipeData`, () => {
        const populatedMockRecipes = mockRecipeData;
        httpService.get.and.returnValue(of(populatedMockRecipes));
        actions = of({ type: RecipeActions.FETCH_RECIPES });

        effects.fetchRecipes.subscribe(action => {
          expect(action.type).toBe(RecipeActions.SET_RECIPES);
          expect(JSON.stringify(action.payload))
            .toEqual(JSON.stringify(populatedMockRecipes));
        });
    });
  });

  describe('storeRecipes', () => {
    it(`should dispatch StoreRecipesSuccess action when StoreRecipes is dispatched
      and it storing recipes succeeds`, () => {
        httpService.put.and.returnValue(of([]));
        actions = of({ type: RecipeActions.STORE_RECIPES });

        effects.storeRecipes.subscribe(action => {
          expect(action.type).toBe(RecipeActions.STORE_RECIPES_SUCCESS);
        });
    });

    it(`should dispatch StoreRecipesFail action when StoreRecipes is dispatched
      and storing recipes fails`, () => {
        httpService.put.and.returnValue(throwError(null));
        actions = of({ type: RecipeActions.STORE_RECIPES });

        effects.storeRecipes.subscribe(action => {
          expect(action.type).toBe(RecipeActions.STORE_RECIPES_FAIL);
        });
    });
  });

  describe('storeRecipesSuccess', () => {
    it(`should call alertRequestInitialiser.init with 'save success' label
      and 'success' alert enum, when StoreRecipes is dispatched`, () => {
        spyOn(alertRequestInitialiser, 'init');
        expectedCreateNewAlertArgs = [Constants.recipesSavedSuccessfullyLabel, Alert.success];
        actions = of({ type: RecipeActions.STORE_RECIPES_SUCCESS });

        effects.storeRecipesSuccess.subscribe(action => {
          expect(alertRequestInitialiser.init).toHaveBeenCalledWith(...expectedCreateNewAlertArgs);
        });
    });
  });

  describe('storeRecipesFail', () => {
    it(`should call alertRequestInitialiser.init with 'save success' label
      and 'success' alert enum, when StoreRecipes is dispatched`, () => {
        spyOn(alertRequestInitialiser, 'init');
        expectedCreateNewAlertArgs = [Constants.recipesSavedFailedLabel, Alert.danger];
        actions = of({ type: RecipeActions.STORE_RECIPES_FAIL });

        effects.storeRecipesFail.subscribe(action => {
          expect(alertRequestInitialiser.init).toHaveBeenCalledWith(...expectedCreateNewAlertArgs);
        });
    });
  });
});
