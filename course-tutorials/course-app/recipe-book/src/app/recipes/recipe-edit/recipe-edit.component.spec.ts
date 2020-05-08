import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { from } from 'rxjs';
import { DebugElement, Type } from '@angular/core';

import { RecipeEditComponent } from './recipe-edit.component';
import { setTestProps } from 'src/app/shared/utils/test-helpers';
import { mockRecipeData, mockRecipeComponentState } from '../store/recipe-helper';
import { Constants } from 'src/app/shared/constants';
import * as fromApp from 'src/app/store/app.reducer';
import * as RecipeActions from 'src/app/recipes/store/recipe.actions';

describe('RecipeEditComponent', () => {
  let store:                MockStore<fromApp.AppState>;
  let componentState:       fromApp.AppState;
  let router:               Router;
  let index:                number;
  let saveRecipeBtn:        DebugElement;
  let fixture:              ComponentFixture<RecipeEditComponent>;
  let component:            RecipeEditComponent;
  let componentHtmlElement: HTMLElement;
  let dispatchSpy;
  let closeRecipeSpy;

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  beforeEach(() => {
    componentState = mockRecipeComponentState;
    index = 0;

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [RecipeEditComponent],
      providers: [
        provideMockStore({ initialState: { ...componentState } }),
        { provide: ActivatedRoute, useValue: { 'params': from([{ 'id': index }]) } }
      ]
    });
  });

  describe(`when 'isEditMode' member is set to true`, () => {
    let updatedRecipeActionPayload;
    beforeEach(() => {
      TestBed.compileComponents();

      ({ store, router, fixture, component, componentHtmlElement }
        = setTestProps(TestBed, RecipeEditComponent));
      fixture.detectChanges();
      dispatchSpy = spyOn(store, 'dispatch');
      closeRecipeSpy = spyOn(component, 'onCloseRecipe');
      saveRecipeBtn = fixture.debugElement.query(By.css('button#save-recipe-btn'));
    });

    it('should create the app', async(() => {
      expect(component).toBeTruthy();
    }));

    it(`should have 'isEditMode' member set to true and a truthy 'id' member value,
      when id is provided in route params`, async(() => {
        expect(component.isEditMode).toBeTruthy();
        expect(component.id).toBe(index);
    }));

    it(`should initialise the form with 'mockRecipeData' values
      and calling the 'pipe' operator on store.select returns a truthy Observable 'Recipe' value`,
      async(() => {
        const nameInput = fixture.debugElement.query(By.css('input#name'));
        const imageInput = fixture.debugElement.query(By.css('input#image-path'));
        const descriptionTextArea = fixture.debugElement.query(By.css('textarea#description'));
        const ingredientInputs = fixture.debugElement.queryAll(By.css('input[id*=ingredient-name-]'));
        const amountInputs = fixture.debugElement.queryAll(By.css('input[id*=ingredient-amount-]'));

        expect(component.isEditMode).toBeTruthy();
        expect(nameInput.nativeElement.value).toBe(mockRecipeData[index].name);
        expect(imageInput.nativeElement.value).toBe(mockRecipeData[index].imagePath);
        expect(descriptionTextArea.nativeElement.value).toBe(mockRecipeData[index].description);
        expect(ingredientInputs.length).toBe(mockRecipeData[index].ingredients.length);
        expect(amountInputs.length).toBe(mockRecipeData[index].ingredients.length);
    }));

    it(`should dispatch RecipeActions.UpdateRecipe with the index of the recipe being updated,
      as well as the new payload coming from the recipeForm, and also call onCloseRecipe() when
      save recipe button is clicked`,
      async(() => {
        const deleteIngredientBtn = fixture.debugElement.query(By.css('button[id*=delete-ingredient-btn-0]'));

        deleteIngredientBtn.nativeElement.click();
        fixture.detectChanges();
        saveRecipeBtn.nativeElement.click();

        updatedRecipeActionPayload = {
          index,
          updatedRecipe: component.recipeForm.value
        };

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new RecipeActions.UpdateRecipe(updatedRecipeActionPayload)
        );
        expect(closeRecipeSpy).toHaveBeenCalledTimes(1);
        expect(component.isEditMode).toBeTruthy();
    }));

    it(`should create a new 'name' FormControl and a new 'amount' FormControl`,
      async(() => {
        const addIngredientBtn              = fixture.debugElement.query(By.css('button[id=add-ingredient-btn]'));
        const initialIngredientNameInputs   = fixture.debugElement.queryAll(By.css('input[id^=ingredient-name-]'));
        const initialIngredientAmountInputs = fixture.debugElement.queryAll(By.css('input[id^=ingredient-amount-]'));

        addIngredientBtn.nativeElement.click();
        fixture.detectChanges();

        const updatedIngredientNameInputs   = fixture.debugElement.queryAll(By.css('input[id^=ingredient-name-]'));
        const updatedIngredientAmountInputs = fixture.debugElement.queryAll(By.css('input[id^=ingredient-amount-]'));

        const newIngredientNameInputCount   = updatedIngredientNameInputs.length - initialIngredientNameInputs.length;
        const newIngredientAmountInputCount = updatedIngredientAmountInputs.length - initialIngredientAmountInputs.length;

        expect(newIngredientNameInputCount).toEqual(1,
          Constants.ingredientNameInputCountDifferenceNotOneErrorString);
        expect(newIngredientAmountInputCount).toEqual(1,
          Constants.ingredientAmountInputCountDifferenceNotOneErrorString);
        expect(component.isEditMode).toBeTruthy();
    }));

    it(`should have call router.navigate ../ relative to ActivatedRoute,
      when close recipe button is clicked`,
      async(() => {
        closeRecipeSpy.and.callThrough();
        spyOn(router, 'navigate');
        const routeExtras: any = { relativeTo: component['route'] };
        const closeRecipeBtn = fixture.debugElement.query(By.css('button#close-recipe-btn'));
        closeRecipeBtn.nativeElement.click();

        expect(router.navigate).toHaveBeenCalledWith(['../'], routeExtras);
    }));

    it(`should delete the specified ingredient when the delete button for that ingredient is clicked`,
      async(() => {
        const deleteFirstIngredientBtn     = fixture.debugElement.query(By.css(`button#delete-ingredient-btn-${index}`));
        const initialIngredients           = fixture.debugElement.queryAll(By.css('button[id*=delete-ingredient-btn-]'));
        const initialFirstIngredientName   = fixture.debugElement.query(By.css(`input#ingredient-name-${index}`));
        const initialFirstIngredientAmount = fixture.debugElement.query(By.css(`input#ingredient-amount-${index}`));

        deleteFirstIngredientBtn.nativeElement.click();
        fixture.detectChanges();

        const updatedIngredients           = fixture.debugElement.queryAll(By.css('button[id*=delete-ingredient-btn-]'));
        const updatedFirstIngredientName   = fixture.debugElement.query(By.css(`input#ingredient-name-${index}`));
        const updatedFirstIngredientAmount = fixture.debugElement.query(By.css(`input#ingredient-amount-${index}`));

        expect(initialFirstIngredientName).not.toEqual(updatedFirstIngredientName,
          Constants.differentFirstIngredientNameErrorString);
        expect(initialFirstIngredientAmount).not.toEqual(updatedFirstIngredientAmount,
          Constants.differentFirstIngredientAmountErrorString);
        expect(initialIngredients.length - updatedIngredients.length).toEqual(1,
          Constants.differentIngredientCountErrorString);
    }));

    it(`should delete all ingredients when the delete all ingredients button is clicked`,
      async(() => {
        const deleteAllIngredientsBtn     = fixture.debugElement.query(By.css(`button#delete-all-ingredients-btn`));
        const initialIngredients          = fixture.debugElement.queryAll(By.css('button[id*=delete-ingredient-btn-]'));

        deleteAllIngredientsBtn.nativeElement.click();
        fixture.detectChanges();

        const updatedIngredients          = fixture.debugElement.queryAll(By.css('button[id*=delete-ingredient-btn-]'));

        expect(initialIngredients.length).toBeGreaterThan(0,
            Constants.initialIngredientsCountGreaterThanZeroErrorString);
        expect(updatedIngredients.length).toBe(0,
            Constants.ingredientsListNotEmptyAfterDeleteAllErrorString);
    }));

    it(`should unsubscribe when ngOnDestroy is called`, async(() => {
        const unsubscribeSpy = spyOn(component['storeSub'], 'unsubscribe');
        component.ngOnDestroy();

        expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe(`when 'isEditMode' member is set to false`, () => {
    beforeEach(() => {
      TestBed.overrideProvider(ActivatedRoute, {useValue: { 'params': from([{}]) }});
      TestBed.compileComponents();

      ({ store, router, fixture, component, componentHtmlElement }
        = setTestProps(TestBed, RecipeEditComponent));
      fixture.detectChanges();
      dispatchSpy = spyOn(store, 'dispatch');
      closeRecipeSpy = spyOn(component, 'onCloseRecipe');
      saveRecipeBtn = fixture.debugElement.query(By.css('button#save-recipe-btn'));
    });

    it(`should dispatch RecipeActions.AddRecipe along with recipeForm payload,
      when recipe form has values added to it and save recipe button is clicked`,
      async(() => {
        component.recipeForm.controls['name'].setValue('test');

        fixture.detectChanges();
        saveRecipeBtn.nativeElement.click();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new RecipeActions.AddRecipe(component.recipeForm.value)
        );
        expect(closeRecipeSpy).toHaveBeenCalledTimes(1);
        expect(component.isEditMode).toBeFalsy();
    }));
  });
});
