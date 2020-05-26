import * as fromShoppingList from './shopping-list.reducer';
import * as ShoppingListActions from './shopping-list.actions';
import { getShoppingListSeedData } from './shopping-list-helper';

let initialState: fromShoppingList.State;
const [existingIngredient, newIngredient] = getShoppingListSeedData();
const index = 0;

describe('Shopping List Reducer', () => {
  describe('ADD_INGREDIENT', () => {
    it('should add new ingredient', () => {
      initialState = {
        ...fromShoppingList.initialState,
        ingredients: []
      };
      const payload = newIngredient;
      const action = new ShoppingListActions.AddIngredient(payload);
      const state = fromShoppingList.shoppingListReducer(initialState, action);

      expect(state.ingredients).toEqual([newIngredient]);
      expect(state.editedIngredient).toEqual(initialState.editedIngredient);
      expect(state.editedIngredientIndex).toEqual(initialState.editedIngredientIndex);
    });
  });

  describe('ADD_INGREDIENTS', () => {
    it('should add multiple ingredients to state', () => {
      initialState = {
        ...fromShoppingList.initialState,
        ingredients: []
      };
      const action = new ShoppingListActions.AddIngredients(getShoppingListSeedData());
      const state = fromShoppingList.shoppingListReducer(initialState, action);

      expect(state.ingredients).toEqual(getShoppingListSeedData());
      expect(state.ingredients.length).toEqual(getShoppingListSeedData().length);
      expect(state.editedIngredient).toEqual(initialState.editedIngredient);
      expect(state.editedIngredientIndex).toEqual(initialState.editedIngredientIndex);
    });
  });

  describe('UPDATE_INGREDIENT', () => {
    it('should update existing ingredient at index provided so that new name matches payload', () => {
      initialState = {
        ingredients: [existingIngredient],
        editedIngredient: existingIngredient,
        editedIngredientIndex: 0
      };
      const updatedIngredient = {...existingIngredient};
      updatedIngredient.name = 'test_name';
      const action = new ShoppingListActions.UpdateIngredient(updatedIngredient);
      const state = fromShoppingList.shoppingListReducer(initialState, action);

      expect(state.ingredients[index].name).not.toEqual(existingIngredient.name);
      expect(state.ingredients[index].amount).toEqual(existingIngredient.amount);
      expect(JSON.stringify(state.ingredients[index])).toEqual(JSON.stringify(updatedIngredient));
      expect(state.editedIngredient).toEqual(fromShoppingList.initialState.editedIngredient);
      expect(state.editedIngredientIndex).toEqual(fromShoppingList.initialState.editedIngredientIndex);
    });
  });

  describe('DELETE_INGREDIENT', () => {
    it(`should delete ingredient at index provided in payload`, () => {
      initialState = {
        ingredients: getShoppingListSeedData(),
        editedIngredient: existingIngredient,
        editedIngredientIndex: index
      };
      const payload = undefined;
      const action = new ShoppingListActions.DeleteIngredient(payload);
      const state = fromShoppingList.shoppingListReducer(initialState, action);

      expect(state.ingredients.length).toEqual(getShoppingListSeedData().length - 1);
      expect(state.ingredients.findIndex(ingredient => ingredient.name === existingIngredient.name)).toEqual(-1);
      expect(state.ingredients.findIndex(ingredient => ingredient.amount === existingIngredient.amount)).toEqual(-1);
      expect(state.editedIngredient).toEqual(fromShoppingList.initialState.editedIngredient);
      expect(state.editedIngredientIndex).toEqual(fromShoppingList.initialState.editedIngredientIndex);
    });
  });

  describe('START_EDIT', () => {
    it(`should update editIngredient and editIngredientIndex to values matching index in payload`, () => {
      initialState = {...initialState, ingredients: getShoppingListSeedData() };
      const action = new ShoppingListActions.StartEdit(index);
      const state = fromShoppingList.shoppingListReducer(initialState, action);

      expect(state.editedIngredient).toEqual(getShoppingListSeedData()[index]);
      expect(state.editedIngredientIndex).toEqual(index);
      expect(JSON.stringify(state.ingredients)).toEqual(JSON.stringify(initialState.ingredients));
    });
  });

  describe('STOP_EDIT', () => {
    it(`should update editIngredient to null and editIngredientIndex to -1`, () => {
      initialState = {...initialState, ingredients: getShoppingListSeedData() };
      const action = new ShoppingListActions.StopEdit();
      const state = fromShoppingList.shoppingListReducer(initialState, action);

      expect(state.editedIngredient).toEqual(null);
      expect(state.editedIngredientIndex).toEqual(-1);
      expect(JSON.stringify(state.ingredients)).toEqual(JSON.stringify(initialState.ingredients));
    });
  });
});
