import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from './shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { Constants } from '../../shared/constants';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { AlertRequestRelayService } from 'src/app/shared/alert/alert-request-relay.service';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private alertRequestRelayService: AlertRequestRelayService
  ) {}

  @Effect({ dispatch: false })
  localStorageShoppingListUpdater = this.actions$.pipe(
    ofType(
      ShoppingListActions.ADD_INGREDIENT,
      ShoppingListActions.ADD_INGREDIENTS,
      ShoppingListActions.UPDATE_INGREDIENT,
      ShoppingListActions.DELETE_INGREDIENT
    ),
    withLatestFrom(this.store.select('shoppingList')),
    tap(([actionData, shoppingListState]) => {
      localStorage.setItem('shoppingList',
        JSON.stringify(shoppingListState.ingredients));
    })
  );

  @Effect({ dispatch: false })
  addIngredients = this.actions$.pipe(
    ofType(ShoppingListActions.ADD_INGREDIENTS),
    tap(() => {
      this.store.dispatch(
        new ShoppingListActions.AddIngredientsSuccess()
      );
    })
  );

  @Effect({ dispatch: false })
  addIngredientsSuccess = this.actions$.pipe(
    ofType(ShoppingListActions.ADD_INGREDIENTS_SUCCESS),
    tap(() => {
      this.alertRequestRelayService.relayNewAlertRequest({
        text: Constants.ingredientsCopiedToShoppingListLabel,
        type: Alert.info
      });
    })
  );
}
