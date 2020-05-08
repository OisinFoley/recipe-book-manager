import * as RecipeActions from './recipe.actions';
import { mockRecipeData } from './recipe-helper';

const index = 0;
const [mockRecipe] = mockRecipeData;

describe('Recipe Actions', () => {
  describe('FetchRecipes', () => {
    it('should create an action', () => {
      const action = new RecipeActions.FetchRecipes();
      expect({ ...action }).toEqual({ type: RecipeActions.FETCH_RECIPES });
    });
  });

  describe('AddRecipe', () => {
    it('should create an action', () => {
      const payload = mockRecipe;
      const action = new RecipeActions.AddRecipe(payload);
      expect({ ...action }).toEqual({ type: RecipeActions.ADD_RECIPE, payload });
    });
  });

  describe('UpdateRecipe', () => {
    it('should create an action', () => {
      const updatedRecipe = mockRecipe;
      updatedRecipe.name = 'test_value';
      const payload = { index, updatedRecipe };
      const action = new RecipeActions.UpdateRecipe(payload);

      expect({ ...action }).toEqual({ type: RecipeActions.UPDATE_RECIPE, payload });
    });
  });

  describe('DeleteRecipe', () => {
    it('should create an action', () => {
      const payload = index;
      const action = new RecipeActions.DeleteRecipe(index);
      expect({ ...action }).toEqual({ type: RecipeActions.DELETE_RECIPE, payload });
    });
  });

  describe('StoreRecipes', () => {
    it('should create an action', () => {
      const action = new RecipeActions.StoreRecipes();
      expect({ ...action }).toEqual({ type: RecipeActions.STORE_RECIPES });
    });
  });

  describe('StoreRecipesSuccess', () => {
    it('should create an action', () => {
      const action = new RecipeActions.StoreRecipesSuccess();
      expect({ ...action }).toEqual({ type: RecipeActions.STORE_RECIPES_SUCCESS });
    });
  });

  describe('StoreRecipesFail', () => {
    it('should create an action', () => {
      const action = new RecipeActions.StoreRecipesFail();
      expect({ ...action }).toEqual({ type: RecipeActions.STORE_RECIPES_FAIL });
    });
  });

  describe('Loading', () => {
    it('should create an action', () => {
      const action = new RecipeActions.Loading();
      expect({ ...action }).toEqual({ type: RecipeActions.LOADING });
    });
  });
});
