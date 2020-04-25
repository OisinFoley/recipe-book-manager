import { Effect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, withLatestFrom, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Constants } from '../../shared/constants';
import { Recipe } from '../recipe.model';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { AlertRequestRelayService } from 'src/app/shared/alert/alert-request-relay.service';

const handleError = () => {
  return of(new RecipesActions.StoreRecipesFail());
};

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private alertRequestRelayService: AlertRequestRelayService
  ) {}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
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
    map((recipes) => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect()
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http
        .put(
          Constants.firebaseBackendStoreUrl,
          recipesState.recipes
        ).pipe(
          map(() => {
            return new RecipesActions.StoreRecipesSuccess();
          }),
          catchError(() => {
            return handleError();
          })
        );
    })
  );

  @Effect({ dispatch: false })
  storeRecipesSuccess = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES_SUCCESS),
    tap(() => {
      this.alertRequestRelayService.relayNewAlertRequest({
        text: Constants.recipesSavedSuccessfullyLabel,
        type: Alert.success
      });
    })
  );

  @Effect({ dispatch: false })
  storeRecipesFail = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES_FAIL),
    tap(() => {
      this.alertRequestRelayService.relayNewAlertRequest({
        text: Constants.recipesSavedFailedLabel,
        type: Alert.danger
      });
    })
  );
}
