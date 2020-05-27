import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/store/app.reducer';
import { Constants } from 'src/app/shared/constants';
import { Recipe } from '../models/recipe.model';
import { recipeListFadeOutTrigger } from 'src/app/shared/animation-triggers';
import { State as RecipeState } from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [recipeListFadeOutTrigger]
})
export class RecipeListComponent implements OnInit, OnDestroy {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  private _subscription: Subscription;
  disableListFadeOut = false;
  recipes: Recipe[];
  constants = Constants;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
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

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
