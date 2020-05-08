import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
import { Ingredient } from '../shared/models/ingredient.model';
import { shoppingListTrigger } from '../shared/animation-triggers';
import { State } from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations: [shoppingListTrigger]
})
export class ShoppingListComponent implements OnInit, AfterViewInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private _storeSub: Subscription;
  private _latestUpdateIngredientsLength = 0;
  private _shoppingListContainerEl: HTMLElement;

  get storeSub(): Subscription { return this._storeSub; }
  set storeSub(e: Subscription) { this._storeSub = e; }
  get shoppingListContainerEl(): HTMLElement { return this._shoppingListContainerEl; }
  set shoppingListContainerEl(e: HTMLElement) { this._shoppingListContainerEl = e; }
  get latestUpdateIngredientsLength(): number { return this._latestUpdateIngredientsLength; }
  set latestUpdateIngredientsLength(e: number) { this._latestUpdateIngredientsLength = e; }

  constructor(
    private store: Store<fromApp.AppState>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('shoppingList')
      .subscribe(stateData => {
        this._handleStoreUpdate(stateData);
      });
  }

  private _handleStoreUpdate(stateData: State) {
    if (stateData.ingredients.length !== this.latestUpdateIngredientsLength) {
      this.ingredients = stateData.ingredients;
      this.cd.detectChanges();

      const newIngredientWasAdded = this._newIngredientWasAdded(
        stateData.ingredients, this.latestUpdateIngredientsLength
      );
      this.latestUpdateIngredientsLength = stateData.ingredients.length;
      this._updateShoppingListRefMember();

      // create listener for new anchor
      if (newIngredientWasAdded) {
        return this._addAnchorClickListener();
      }

      // initialise anchor listeners
      this._setupAnchorClickListeners();
    }

    if (stateData.editedIngredientIndex === -1) {
      this._removeCurrentActiveClassFromAnchor();
    }
  }

  ngAfterViewInit() {
    this._updateShoppingListRefMember();
    this._setupAnchorClickListeners();
  }

  onEditItem(index: number) {
    this.store.dispatch(
      new ShoppingListActions.StartEdit(index)
    );
  }

  private _updateShoppingListRefMember() {
    this._shoppingListContainerEl = document.getElementById('shopping-list-container');
  }

  private _newIngredientWasAdded(
    ingredients: Ingredient[],
    latestIngredientsLength: number
  ): boolean {
    return (ingredients.length - 1) === this.latestUpdateIngredientsLength;
  }

  private _setupAnchorClickListeners() {
    const shoppingListUl = this._shoppingListContainerEl;
    const anchorEls = shoppingListUl.getElementsByTagName('a');

    for (let i = 0; i < anchorEls.length; i++) {
      this._addClickEventToElement(anchorEls[i]);
    }
  }

  private _addAnchorClickListener() {
    const newIngredientAnchor = this._shoppingListContainerEl.lastElementChild;
    this._addClickEventToElement(newIngredientAnchor);
  }

  private _addClickEventToElement(el) {
    const component = this;
    el.addEventListener('click', function() {
      component._removeCurrentActiveClassFromAnchor();
      this.className += ' active';
    });
  }

  private _removeCurrentActiveClassFromAnchor() {
    const current = this._shoppingListContainerEl.getElementsByClassName('active');
    if (current.length > 0) {
      current[0].className = current[0].className.replace('active', '');
    }
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
