import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { TestBed, async } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { State } from '../store/shopping-list.reducer';
import { AlertRequestInitialiser } from 'src/app/shared/alert/alert-request-initialiser.service';
import { mockDefaultAppState } from 'src/app/shared/utils/test-helpers';
import { getShoppingListSeedData } from './shopping-list-helper';
import { ShoppingListEffects } from './shopping-list.effects';
import { Alert } from 'src/app/shared/alert/alert.enum';
import { Constants } from 'src/app/shared/constants';
import * as ShoppingListActions from './shopping-list.actions';
import * as fromApp from 'src/app/store/app.reducer';

describe('ShoppingListEffects', () => {
  const mockShoppingListData =    getShoppingListSeedData();
  let store:                      MockStore<fromApp.AppState>;
  let actions:                    Observable<Action>;
  let effects:                    ShoppingListEffects;
  let alertRequestInitialiser:    AlertRequestInitialiser;
  let expectedCreateNewAlertArgs: any[];

  beforeEach(async(() => {
    const shoppingListState: State = {
      ...mockDefaultAppState.shoppingList,
      ingredients: mockShoppingListData
    };
    const appState: fromApp.AppState = {
      ...mockDefaultAppState,
      shoppingList: {...shoppingListState}
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        ShoppingListEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState: { ...appState } }),
      ],
    });

    effects = TestBed.get<ShoppingListEffects>(ShoppingListEffects);
    alertRequestInitialiser = TestBed.get<AlertRequestInitialiser>(AlertRequestInitialiser);
    store = TestBed.get<Store<fromApp.AppState>>(Store);
  }));

  describe('localStorageShoppingListUpdater', () => {
    it(`should take latest from shoppingList store and save it to localStorage,
      when UpdateIngredients is dispatched`, () => {
        spyOn(localStorage, 'setItem');
        actions = of({ type: ShoppingListActions.UPDATE_INGREDIENT });

        effects.localStorageShoppingListUpdater.subscribe(() => {
          expect(localStorage.setItem).toHaveBeenCalledWith(
            'shoppingList', JSON.stringify(mockShoppingListData)
          );
        });
    });
  });

  describe('addIngredients', () => {
    it(`should dispatch AddIngredientsSuccess, when AddIngredients is dispatched`, () => {
        spyOn(localStorage, 'setItem');
        spyOn(store, 'dispatch');
        actions = of({ type: ShoppingListActions.ADD_INGREDIENTS });

        effects.addIngredients.subscribe(() => {
          expect(store.dispatch).toHaveBeenCalledWith(
            new ShoppingListActions.AddIngredientsSuccess()
          );
        });
    });
  });

  describe('addIngredientsSuccess', () => {
    it(`should call alertRequestInitialiser.init with 'ingredients copied' and 'info' enum,
      when AddIngredientsSuccess is dispatched`, () => {
        spyOn(alertRequestInitialiser, 'init');
        expectedCreateNewAlertArgs = [Constants.ingredientsCopiedToShoppingListLabel, Alert.info];
        actions = of({ type: ShoppingListActions.ADD_INGREDIENTS_SUCCESS });

        effects.addIngredientsSuccess.subscribe(() => {
          expect(alertRequestInitialiser.init).toHaveBeenCalledWith(...expectedCreateNewAlertArgs);
        });
    });
  });

});
