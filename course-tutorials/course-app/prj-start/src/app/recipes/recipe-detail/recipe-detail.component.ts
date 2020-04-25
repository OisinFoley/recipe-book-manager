import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Constants } from '../../shared/constants';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent {
  private _recipe: Recipe;
  private _id: number;
  constants = Constants;

  get id(): number { return this._id; }
  set id(e: number) { this._id = e; }
  get recipe(): Recipe { return this._recipe; }
  set recipe(e: Recipe) { this._recipe = e; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.route.params
      .pipe(
        map((params: Params) => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipeState => {
          return recipeState.recipes.find((recipe, i) => {
            return i === this.id;
          });
        })
      )
      .subscribe(recipe => {
        if (!recipe) {
          return this.router.navigateByUrl('/recipes');
        }
        this.recipe = recipe;
      });
  }

  isDisabled(recipe: Recipe): boolean {
    return recipe.ingredients.length === 0;
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onAddToShoppingList(recipe: Recipe) {
    if (this.isDisabled(recipe)) {
      return;
    }
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  onDeleteRecipe() {
    if (confirm(this.constants.confirmDeleteRecipeLabel)) {
      this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
      this.router.navigate(['/recipes']);
    }
  }
}
