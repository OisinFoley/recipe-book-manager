import { Recipe } from '../models/recipe.model';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { mockDefaultAppState } from 'src/app/shared/utils/test-helpers';

export const mockRecipeData = [
  new Recipe(
    'Apple Pie',
    'Tasty Apple Pie',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Apple_pie.jpg/1024px-Apple_pie.jpg',
    [
      new Ingredient('apples', 4),
      new Ingredient('sugar (25g)', 2)
    ]
  ),
  new Recipe(
    'Chicken Soup',
    'Delicious Soup',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpb_UpXwyP7ZvngsNsiB-g24B6j9gQmTmJK_Sz2u3iNCPhAfg9Q&s',
    []
  )
];

export const getRecipeSeedData = () => {
  return mockRecipeData;
};

const recipeState = {
  ...mockDefaultAppState.recipes,
  recipes: mockRecipeData
};

export const mockRecipeComponentState = {
  ...mockDefaultAppState,
  recipes: {...recipeState}
};
