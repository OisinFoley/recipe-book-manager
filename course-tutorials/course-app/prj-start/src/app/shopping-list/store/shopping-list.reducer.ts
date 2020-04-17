import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 40),
    new Ingredient('Banana', 20)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function ShoppingListReducer(
    state = initialState,
    action: ShoppingListActions.ShoppingListActionsType
  ) {
    switch (action.type) {
      case ShoppingListActions.ADD_INGREDIENT:
        return {
          ...state,
          ingredients: [...state.ingredients, action.payload]
        };
      case ShoppingListActions.ADD_INGREDIENTS:
        return {
          ...state,
          ingredients: [...state.ingredients, ...action.payload]
        };
      case ShoppingListActions.UPDATE_INGREDIENT:
        const updatedIngredient = {
          ...action.payload
        };
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

        return {
          ...state,
          ingredients: updatedIngredients,
          editedIngredient: null,
          editedIngredientIndex: -1
        };
      case ShoppingListActions.DELETE_INGREDIENT:
        return {
          ...state,
          ingredients: state.ingredients.filter(
            (ing, i) => i !== state.editedIngredientIndex
          ),
          editedIngredient: null,
          editedIngredientIndex: -1
        };
      case ShoppingListActions.START_EDIT:
        return {
          ...state,
          editedIngredientIndex: action.payload,
          editedIngredient: { ...state.ingredients[action.payload] }
        };
      case ShoppingListActions.STOP_EDIT:
        return {
          ...state,
          editedIngredientIndex: -1,
          editedIngredient: null
        };
      default:
        return state;
    }
}
