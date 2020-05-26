import { FormArray } from '@angular/forms';

export interface RecipeFormGroup {
  recipeName: string;
  recipeImagePath: string;
  recipeDescription: string;
  recipeIngredients: FormArray;
}
