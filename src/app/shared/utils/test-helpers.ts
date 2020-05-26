import { TestBedStatic } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Type } from '@angular/core';

import * as fromApp from 'src/app/store/app.reducer';
import * as fromShoppingList from 'src/app/shopping-list/store/shopping-list.reducer';
import * as fromAuth from 'src/app/auth/store/auth.reducer';
import * as fromRecipes from 'src/app/recipes/store/recipe.reducer';

export const mockDefaultAppState: fromApp.AppState = {
  shoppingList: fromShoppingList.initialState,
  auth: fromAuth.initialState,
  recipes: fromRecipes.initialState
};

export const setTestProps =
  <T>(
    TestBedSetup: TestBedStatic,
    componentClass: Type<T>,
    ignoreList: string[] = []
  ) => {
    let store;
    let router;
    if (!ignoreList.includes('store')) {
      store = TestBedSetup.get<Store<fromApp.AppState>>(Store);
    }
    if (!ignoreList.includes('router')) {
      router = TestBedSetup.get(Router);
    }

    const fixture = TestBedSetup.createComponent<T>(componentClass);
    const component = fixture.componentInstance;
    const componentHtmlElement = fixture.debugElement.nativeElement;

    return {
      store,
      router,
      fixture,
      component,
      componentHtmlElement
    };
};
