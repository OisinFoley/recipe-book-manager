import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Constants } from '../../shared/constants';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  private readonly _subscription: Subscription;
  private _editMode = false;
  private _editedItem: Ingredient;
  constants = Constants;

  get editMode(): boolean { return this._editMode; }
  set editMode(e: boolean) { this._editMode = e; }

  constructor(
    private store: Store<fromApp.AppState>
  ) {
    this._subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this._editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this._editedItem.name,
          amount: this._editedItem.amount
        });
        return;
      }
      this.editMode = false;
    });
  }

  onSubmit(form: NgForm) {
    const { value } = form;
    const newIngredient = new Ingredient(value.name, value.amount);

    this.editMode
    ? this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      )
    : this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));

    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
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
