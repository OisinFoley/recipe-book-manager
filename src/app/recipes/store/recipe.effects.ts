import { Effect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, withLatestFrom, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Constants } from '../../shared/constants';
import { Recipe } from '../models/recipe.model';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { AlertRequestInitialiser } from 'src/app/shared/alert/alert-request-initialiser.service';

const handleError = () => {
  return of(new RecipeActions.StoreRecipesFail());
};

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private alertRequestInitialiser: AlertRequestInitialiser
  ) {}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(Constants.firebaseBackendStoreUrl);
    }),
    map(recipes => {
      if (!recipes) {
        return [];
      }
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipeActions.SetRecipes(recipes);
    })
  );

  @Effect()
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http
        .put(
          Constants.firebaseBackendStoreUrl,
          recipesState.recipes
        ).pipe(
          map(() => {
            return new RecipeActions.StoreRecipesSuccess();
          }),
          catchError(() => {
            return handleError();
          })
        );
    })
  );

  @Effect({ dispatch: false })
  storeRecipesSuccess = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES_SUCCESS),
    tap(() => {
      this.alertRequestInitialiser.init(
        Constants.recipesSavedSuccessfullyLabel, Alert.success);
    })
  );

  @Effect({ dispatch: false })
  storeRecipesFail = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES_FAIL),
    tap(() => {
      this.alertRequestInitialiser.init(
        Constants.recipesSavedFailedLabel, Alert.danger);
    })
  );
}
