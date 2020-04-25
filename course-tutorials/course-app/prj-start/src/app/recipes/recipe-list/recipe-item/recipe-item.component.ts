import { Component, Input } from '@angular/core';

import { Recipe } from '../../recipe.model';
import { recipeListFadeInTrigger } from 'src/app/shared/animation-triggers';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
  animations: [recipeListFadeInTrigger]
})
export class RecipeItemComponent {
  @Input() recipe: Recipe;
  @Input() index: number;
}
