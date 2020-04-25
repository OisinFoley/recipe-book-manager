import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import { Constants } from '../../shared/constants';
import { Recipe } from '../recipe.model';
import { recipeListFadeOutTrigger } from 'src/app/shared/animation-triggers';
import { State as RecipeState } from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [recipeListFadeOutTrigger]
})
export class RecipeListComponent implements OnDestroy {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  private readonly _subscription: Subscription;
  disableListFadeOut = false;
  recipes: Recipe[];
  constants = Constants;

  get subscription(): Subscription { return this._subscription; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {
    this._subscription = this.store
      .select('recipes')
      .pipe(map((recipeState: RecipeState) => recipeState))
      .subscribe((recipeState: RecipeState) => {
        if (recipeState.loading) {
          return this.disableListFadeOut = true;
        }
        this.recipes = recipeState.recipes;
        this.disableListFadeOut = false;
      });
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
