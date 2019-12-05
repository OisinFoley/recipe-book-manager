import { Recipe } from "./recipe.model";
import { EventEmitter, Injectable } from "@angular/core";
// import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  // do not need eventemitter nor subject since we added routing, this approach is no longer needed
  // and is instead handled by a directive.
  // note: we're still using a subject in the shopping list components
  // recipeSelected = new EventEmitter<Recipe>();
  // recipeSelected = new Subject<Recipe>();
  private recipes: Recipe[] = [
    new Recipe('Num 1 Test Recipe', 'the original and 1st recipe - just a test',
      'https://storage.needpix.com/rsynced_images/gastronomy-2760200_1280.jpg',
      [
        new Ingredient('Potatoes', 7),
        new Ingredient('Chicken Breasts', 2)
      ]),
    new Recipe('Num 2 Test Recipe', 'the 2nd recipe',
      'https://storage.needpix.com/rsynced_images/gastronomy-2760200_1280.jpg',
      [
        new Ingredient('Salmon', 1),
        new Ingredient('Carrots', 12)
      ])
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }


}