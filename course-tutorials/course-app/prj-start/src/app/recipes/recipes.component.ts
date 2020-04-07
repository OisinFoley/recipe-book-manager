import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  // selectedRecipe: Recipe;

  // recipeService not needed because of routing and use of routing directives
  // see shopping-list component for example of Subject and rxjs working
  constructor(
    // private recipeService: RecipeService
  ) {}

  ngOnInit() {
    // this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
    //   this.selectedRecipe = recipe;
    // })
  }
}
