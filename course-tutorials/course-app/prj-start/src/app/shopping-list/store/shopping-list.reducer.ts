import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

function getInitialIngredients(): Ingredient[] {
  const ingredientsFromStorage = JSON.parse(localStorage.getItem('shoppingList'));
  const seedData = [
    new Ingredient('Apples', 40),
    new Ingredient('Banana', 20)
  ];
  return ingredientsFromStorage ? ingredientsFromStorage : seedData;
}

const initialState: State = {
  ingredients: getInitialIngredients(),
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
