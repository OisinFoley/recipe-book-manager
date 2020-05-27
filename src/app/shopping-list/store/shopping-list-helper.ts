import { Ingredient } from 'src/app/shared/models/ingredient.model';

export const getShoppingListSeedData = () => {
  return [
    new Ingredient('Apples', 40),
    new Ingredient('Banana', 20)
  ];
};
