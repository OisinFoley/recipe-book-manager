import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Constants } from '../shared/constants';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  private _userSub: Subscription;
  private _isAuthenticated = false;
  private _collapsed = false;
  constants = Constants;

  get isAuthenticated(): boolean { return this._isAuthenticated; }
  set isAuthenticated(e: boolean) { this._isAuthenticated = e; }
  get collapsed(): boolean { return this._collapsed; }
  set collapsed(e: boolean) { this._collapsed = e; }
  get userSub(): Subscription { return this._userSub; }

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this._userSub = this.store
      .select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData() {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipeActions.Loading());
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
