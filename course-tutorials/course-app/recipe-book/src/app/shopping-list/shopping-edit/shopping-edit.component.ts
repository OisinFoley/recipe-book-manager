import { Component, ViewChild, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Constants } from '../../shared/constants';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) slForm: NgForm;
  private _subscription: Subscription;
  private _isEditMode = false;
  private _editedItem: Ingredient;
  constants = Constants;

  get isEditMode(): boolean { return this._isEditMode; }
  set isEditMode(e: boolean) { this._isEditMode = e; }

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this._subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.isEditMode = true;
        this._editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this._editedItem.name,
          amount: this._editedItem.amount
        });
        return;
      }
      this.isEditMode = false;
    });
  }

  onSubmit(form: NgForm) {
    const { value } = form;
    const newIngredient = new Ingredient(value.name, value.amount);

    this.isEditMode
    ? this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      )
    : this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));

    this.isEditMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.isEditMode = false;
    this.store.dispatch(
      new ShoppingListActions.StopEdit()
    );
  }

  onDelete() {
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient()
    );
    this.onClear();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this.store.dispatch(
      new ShoppingListActions.StopEdit()
    );
  }
}
