import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as fromApp from 'src/app/store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { Constants } from 'src/app/shared/constants';
import { recipeEditTrigger } from 'src/app/shared/animation-triggers';
import { Recipe } from '../models/recipe.model';
import { RecipeFormGroup } from '../interfaces/recipe-form-group';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
  animations: [recipeEditTrigger]
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private _id: number;
  private _isEditMode = false;
  private _storeSub: Subscription;
  recipeForm: FormGroup;
  constants = Constants;

  get id(): number { return this._id; }
  set id(e: number) { this._id = e; }
  get isEditMode(): boolean { return this._isEditMode; }
  set isEditMode(e: boolean) { this._isEditMode = e; }
  get storeSub(): Subscription { return this._storeSub; }
  set storeSub(e: Subscription) { this._storeSub = e; }
  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.isEditMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    this.isEditMode
    ? this.store.dispatch(
      new RecipeActions.UpdateRecipe({
        index: this.id,
        updatedRecipe: this.recipeForm.value
      })
    )
    : this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));

    this.onCloseRecipe();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  private initForm() {
    const formGroupProps: RecipeFormGroup = {
      recipeName: '',
      recipeImagePath: '',
      recipeDescription: '',
      recipeIngredients: new FormArray([])
    };

    if (this.isEditMode) {
      this._subscribeToFormValues(formGroupProps);
    }

    this._initFormGroup(formGroupProps);
  }

  private _initFormGroup(formGroupProps: RecipeFormGroup) {
    this.recipeForm = new FormGroup({
      'name': new FormControl(formGroupProps.recipeName, Validators.required),
      'imagePath': new FormControl(formGroupProps.recipeImagePath),
      'description': new FormControl(formGroupProps.recipeDescription),
      'ingredients': formGroupProps.recipeIngredients
    });
  }

  private _subscribeToFormValues(formGroupProps: RecipeFormGroup) {
    this.storeSub = this.store
      .select('recipes')
      .pipe(
        map(recipeState => {
          return recipeState.recipes.find((recipe, i) => {
            return i === this.id;
          });
        })
      )
      .subscribe((recipe => {
        formGroupProps.recipeName = recipe.name;
        formGroupProps.recipeImagePath = recipe.imagePath;
        formGroupProps.recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          this._mapIngredientsToFormGroups(formGroupProps, recipe);
        }
      }));
  }

  private _mapIngredientsToFormGroups(formGroupProps: RecipeFormGroup, recipe: Recipe) {
    for (const ingredient of recipe.ingredients) {
      formGroupProps.recipeIngredients.push(
        new FormGroup({
          'name': new FormControl(ingredient.name, Validators.required),
          'amount': new FormControl(ingredient.amount, [
            Validators.required,
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
        })
      );
    }
  }

  onCloseRecipe() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onDeleteAllIngredients() {
    (<FormArray>this.recipeForm.get('ingredients')).clear();
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
