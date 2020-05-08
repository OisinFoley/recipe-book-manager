import { environment as env } from '../../environments/environment';
/* tslint:disable */
export class Constants {
  static apiBase = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  static firebaseSignUpAction = 'signUp';
  static firebaseSignInAction = 'signInWithPassword';
  static firebaseSignUpUrl = `${Constants.apiBase}${Constants.firebaseSignUpAction}?key=${env.firebaseKey}`;
  static firebaseSignInUrl = `${Constants.apiBase}${Constants.firebaseSignInAction}?key=${env.firebaseKey}`;
  static firebaseBackendStoreUrl = 'https://angular-course-app-e750b.firebaseio.com/recipes.json';
  static firebaseAuthErrors = {
    emailAlreadyExists: 'EMAIL_EXISTS',
    emailNotFound: 'EMAIL_NOT_FOUND',
    invalidPassword: 'INVALID_PASSWORD'
  };
  static unknownErrorMessage = 'An unknown error occurred';
  static emailLabel = 'Email';
  static passwordLabel = 'Password';
  static loginLabel = 'Login';
  static signupLabel = 'Signup';
  static recipeBookLabel = 'Recipe Book';
  static recipesLabel = 'Recipes';
  static emailAlreadyExistsLabel = 'A user already exists for this email address';
  static emailNotFoundLabel = 'This email does not exist';
  static passwordIncorrectLabel = 'This password is not correct';
  static authenticateLabel = 'Authenticate';
  static authenticationTokenTimeoutLabel = 'Auto logout due to authentication token expiry - sign-in again';
  static shoppingListLabel = 'Shopping List';
  static toShoppingListLabel = 'To Shopping List';
  static toShoppingListDisabledLabel = 'You cannot add an empty recipe list to your shopping list';
  static ingredientsCopiedToShoppingListLabel = 'Ingredients were copied to your Shopping List';
  static newRecipeLabel = 'New Recipe';
  static editRecipeLabel = 'Edit Recipe';
  static deleteRecipeLabel = 'Delete Recipe';
  static confirmDeleteRecipeLabel = 'Are you sure you want to delete this recipe?';
  static recipeEditInvalidFormLabel = 'Provide recipe name and ensure any "Ingredient" text boxes below are filled'
  static emptyRecipesSuggestionLabel = 'Looks a bit empty here - Try adding recipes via "New Recipe" or load some using "Manage Data" in the navbar menu';
  static logoutLabel = 'Logout';
  static manageDataLabel = 'Manage Data';
  static manageRecipeLabel = 'Manage Recipe';
  static saveRecipesLabel = 'Save Recipes to Database';
  static fetchRecipesLabel = 'Load Recipes from Database';
  static recipesSavedSuccessfullyLabel = 'Recipes were saved to Database';
  static recipesSavedFailedLabel = 'Saving recipes failed - Please try again';
  static saveChangesLabel = 'Save';
  static closeRecipeLabel = 'Close Recipe';
  static nameLabel = 'Name';
  static imageUrlLabel = 'Image URL';
  static descriptionLabel = 'Description';
  static addIngredientLabel = 'Add Ingredient';
  static deleteAllIngredientsLabel = 'Delete All Ingredients';
  static amountLabel = 'Amount';
  static updateLabel = 'Update';
  static addLabel = 'Add';
  static deleteLabel = 'Delete';
  static clearSelectionLabel = 'Clear Selection';
  static setShoppingListItemSuggestionLabel = 'Add text to the input boxes or click an existing item to enable this button';
  static deleteShoppingListItemSuggestionLabel = 'Click a shopping list item to enable deletion';
  static selectionAlreadyClearLabel = 'Your selection is already clear - click an item in the list to update it';
  static glyphiconAlertClassName = 'glyphicon-alert';
  static glyphiconSavedClassName = 'glyphicon-saved';
  static glyphiconExclamationClassName = 'glyphicon-exclamation-sign';
  static fadeOutAnimationValue = 'fadeOut ease 1s';
  static differentFirstIngredientNameErrorString = 'first ingredient name input has same value before and after ingredient deletion';
  static differentFirstIngredientAmountErrorString = 'first ingredient amount input has same value before and after ingredient deletion'
  static differentIngredientCountErrorString = 'difference between old and new ingredients list count is not exactly 1 after ingredient deletion';
  static ingredientNameInputCountDifferenceNotOneErrorString = 'difference in ingredient name inputs is not exactly 1';
  static ingredientAmountInputCountDifferenceNotOneErrorString = 'difference in ingredient amount inputs is not exactly 1';
  static initialIngredientsCountGreaterThanZeroErrorString ='initial ingredients list was already 0 before clicking delete all button';
  static ingredientsListNotEmptyAfterDeleteAllErrorString = 'updated ingredients list is not 0 after clicking delete all button';
}
