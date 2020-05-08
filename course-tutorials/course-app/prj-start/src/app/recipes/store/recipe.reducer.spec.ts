import * as fromRecipes from './recipe.reducer';
import * as RecipeActions from './recipe.actions';
import { mockRecipeData } from './recipe-helper';

let initialState: fromRecipes.State;
const [existingRecipe, newRecipe] = mockRecipeData;
const index = 0;

describe('Recipe Reducer', () => {
  describe('SET_RECIPES', () => {
    it('should update recipes list', () => {
      ({ initialState } = fromRecipes);
      const payload = mockRecipeData;
      const action = new RecipeActions.SetRecipes(payload);
      const state = fromRecipes.recipeReducer(initialState, action);

      expect(state.recipes).toEqual(payload);
      expect(state.loading).toEqual(initialState.loading);
    });
  });

  describe('LOADING', () => {
    it('should set loading to true and keep empty recipe state', () => {
      ({ initialState } = fromRecipes);
      const action = new RecipeActions.Loading();
      const state = fromRecipes.recipeReducer(initialState, action);

      expect(state.recipes).toEqual(initialState.recipes);
      expect(state.loading).toEqual(true);
    });
  });

  describe('ADD_RECIPE', () => {
    it('should add new recipe to state and aslo keep the pre-existing recipe', () => {
      initialState = {...initialState, recipes: [existingRecipe] };
      const action = new RecipeActions.AddRecipe(newRecipe);
      const state = fromRecipes.recipeReducer(initialState, action);

      expect(state.recipes.length).toEqual(mockRecipeData.length);
      expect(JSON.stringify(state.recipes)).toEqual(JSON.stringify(mockRecipeData));
      expect(state.loading).toEqual(initialState.loading);
    });
  });

  describe('UPDATE_RECIPE', () => {
    it(`should update name of ingredient at index in payload and all other props
      for that index should remain the same`, () => {
      initialState = {...initialState, recipes: [existingRecipe] };
      const updatedRecipe = {...existingRecipe};
      updatedRecipe.name = 'test_name';
      const action = new RecipeActions.UpdateRecipe({ index, updatedRecipe });
      const state = fromRecipes.recipeReducer(initialState, action);

      expect(state.recipes[index].description).toEqual(existingRecipe.description);
      expect(state.recipes[index].imagePath).toEqual(existingRecipe.imagePath);
      expect(state.recipes[index].ingredients).toEqual(existingRecipe.ingredients);
      expect(state.recipes[index].name).not.toEqual(existingRecipe.name);
      expect(state.loading).toEqual(initialState.loading);
    });
  });

  describe('DELETE_RECIPE', () => {
    it(`should delete recipe at index provided in payload`, () => {
      initialState = {...initialState, recipes: mockRecipeData };
      const action = new RecipeActions.DeleteRecipe(index);
      const state = fromRecipes.recipeReducer(initialState, action);

      expect(state.recipes.length).toEqual(mockRecipeData.length - 1);
      expect(state.recipes[index].name).not.toEqual(mockRecipeData[index].name);
      expect(state.recipes[index].imagePath).not.toEqual(mockRecipeData[index].imagePath);
      expect(state.recipes[index].ingredients).not.toEqual(mockRecipeData[index].ingredients);
      expect(state.recipes[index].ingredients).not.toEqual(mockRecipeData[index].ingredients);
      expect(state.loading).toEqual(initialState.loading);
    });
  });
});
