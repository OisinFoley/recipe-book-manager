import { Recipe } from '../models/recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
  loading: boolean;
}

export const initialState: State = {
  recipes: [],
  loading: false
};

export function recipeReducer (
  state = initialState, action: RecipeActions.RecipeActionTypes
) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        loading: false,
        recipes: [...action.payload]
      };
    case RecipeActions.LOADING:
      return {
        ...state,
        loading: true
      };
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      // grab existing recipe at index position to be updated
      // then overwrite props using payload values
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.updatedRecipe
      };

      // update recipe at index specified in payload
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, i) => {
          return i !== action.payload;
        })
      };
    default:
      return state;
  }
}
