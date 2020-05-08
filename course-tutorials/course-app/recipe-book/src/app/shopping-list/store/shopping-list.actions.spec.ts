import * as ShoppingListActions from './shopping-list.actions';
import { getShoppingListSeedData } from './shopping-list-helper';

const [mockIngredient] = getShoppingListSeedData();
const index = 0;

describe('ShoppingList Actions', () => {
  describe('AddIngredient', () => {
    it('should create an action', () => {
      const payload = mockIngredient;
      const action = new ShoppingListActions.AddIngredient(payload);
      expect({ ...action }).toEqual({ type: ShoppingListActions.ADD_INGREDIENT, payload });
    });
  });

  describe('AddIngredients', () => {
    it('should create an action', () => {
      const payload = getShoppingListSeedData();
      const action = new ShoppingListActions.AddIngredients(payload);
      expect({ ...action }).toEqual({ type: ShoppingListActions.ADD_INGREDIENTS, payload });
    });
  });

  describe('AddIngredientsSuccess', () => {
    it('should create an action', () => {
      const action = new ShoppingListActions.AddIngredientsSuccess();
      expect({ ...action }).toEqual({ type: ShoppingListActions.ADD_INGREDIENTS_SUCCESS });
    });
  });

  describe('UpdateIngredient', () => {
    it('should create an action', () => {
      const payload = mockIngredient;
      const action = new ShoppingListActions.UpdateIngredient(payload);
      expect({ ...action }).toEqual({ type: ShoppingListActions.UPDATE_INGREDIENT, payload });
    });
  });

  describe('DeleteIngredient', () => {
    it('should create an action', () => {
      const action = new ShoppingListActions.DeleteIngredient();
      expect({ ...action }).toEqual({ type: ShoppingListActions.DELETE_INGREDIENT, payload: undefined });
    });
  });

  describe('StartEdit', () => {
    it('should create an action', () => {
      const payload = index;
      const action = new ShoppingListActions.StartEdit(payload);
      expect({ ...action }).toEqual({ type: ShoppingListActions.START_EDIT, payload });
    });
  });

  describe('StopEdit', () => {
    it('should create an action', () => {
      const action = new ShoppingListActions.StopEdit();
      expect({ ...action }).toEqual({ type: ShoppingListActions.STOP_EDIT });
    });
  });
});
