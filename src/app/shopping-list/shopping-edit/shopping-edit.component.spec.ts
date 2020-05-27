import { TestBed, async, tick, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { State as ShoppingListState } from '../store/shopping-list.reducer';
import { getShoppingListSeedData } from '../store/shopping-list-helper';
import { ShoppingEditComponent } from './shopping-edit.component';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { mockDefaultAppState, setTestProps } from 'src/app/shared/utils/test-helpers';
import * as fromApp from 'src/app/store/app.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

const getSubmitBtn = (compfixture: ComponentFixture<ShoppingEditComponent>) => {
  return compfixture.debugElement.query(By.css('button[type="submit"]'));
};

describe('ShoppingEditComponent', () => {
  const seedData =          getShoppingListSeedData();
  let store:                MockStore<fromApp.AppState>;
  let fixture:              ComponentFixture<ShoppingEditComponent>;
  let component:            ShoppingEditComponent;
  let componentHtmlElement: HTMLElement;
  let dispatchSpy;

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  describe('When an item is selected', () => {
    const IsEditingShoppingListState: ShoppingListState = {
      ingredients: seedData,
      editedIngredient: seedData[0],
      editedIngredientIndex: 0
    };

    beforeEach(
      fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [FormsModule],
          declarations: [ShoppingEditComponent],
          providers: [
            provideMockStore({ initialState: { ...mockDefaultAppState } })
          ]
        });
        TestBed.compileComponents();

        ({ store, fixture, component, componentHtmlElement }
          = setTestProps(TestBed, ShoppingEditComponent, ['router']));
        dispatchSpy = spyOn(store, 'dispatch');
        tick();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          store.setState({
            ...mockDefaultAppState,
            shoppingList: {
              ...IsEditingShoppingListState,
            }
          });
        });
      })
    );

    it('should have \'isEditMode = true\' and form values should be set to name and amount of the selected ingredient',
      fakeAsync(() => {
        tick();
        fixture.detectChanges();

        expect(component['isEditMode']).toEqual(true);
      })
    );

    it(`should dispatch ShoppingListActions.UpdateIngredient action when submit button is clicked
      and 'isEditMode' should = false`,
      fakeAsync(() => {
        const submitBtn = getSubmitBtn(fixture);
        const updatedIngredient: Ingredient = new Ingredient(
          seedData[0].name,
          12345
        );
        tick();
        fixture.detectChanges();

        component.slForm.setValue(updatedIngredient);
        tick();
        fixture.detectChanges();

        submitBtn.nativeElement.click();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new ShoppingListActions.UpdateIngredient(updatedIngredient)
        );
        expect(component['isEditMode']).toEqual(false);
      })
    );

    it(`should dispatch ShoppingListActions.StopEdit action when clear button is clicked
      and 'isEditMode' should = false`,
      fakeAsync(() => {
        const clearBtn = fixture.debugElement.query(By.css('button#clear-shopping-item-selection-btn'));
        tick();
        fixture.detectChanges();

        clearBtn.nativeElement.click();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new ShoppingListActions.StopEdit()
        );
        expect(component['isEditMode']).toEqual(false);
      })
    );

    it(`should dispatch ShoppingListActions.DeleteIngredient action when delete button is clicked
      and call onClear()`,
      fakeAsync(() => {
        const onClearSpy = spyOn(component, 'onClear');
        const deleteBtn = fixture.debugElement.query(By.css('button#delete-shopping-item-btn'));
        tick();
        fixture.detectChanges();

        deleteBtn.nativeElement.click();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new ShoppingListActions.DeleteIngredient()
        );
        expect(onClearSpy).toHaveBeenCalledTimes(1);
      })
    );

    it(`should dispatch ShoppingListActions.StopEdit action and unsubscribe when ngOnDestroy is called`,
      fakeAsync(() => {
        const unsubscribeSpy = spyOn(component['_subscription'], 'unsubscribe');

        component.ngOnDestroy();

        expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new ShoppingListActions.StopEdit()
        );
      })
    );
  });

  describe('When an item is \'not\' selected', () => {
    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, FormsModule],
        declarations: [ShoppingEditComponent],
        providers: [
          provideMockStore({ initialState: { ...mockDefaultAppState } })
        ]
      });
      TestBed.compileComponents();

      ({ store, fixture, component, componentHtmlElement }
        = setTestProps(TestBed, ShoppingEditComponent));
      dispatchSpy = spyOn(store, 'dispatch');
      tick();
      fixture.detectChanges();
    }));

    it('should create the app', async(() => {
      expect(component).toBeTruthy();
    }));

    it('should dispatch ShoppingListActions.AddIngredient action when submit button is clicked',
      fakeAsync(() => {
        const [{ name, amount }] = getShoppingListSeedData();
        const ingredient: Ingredient = new Ingredient(name, amount);

        component.slForm.setValue(ingredient);

        const submitBtn = getSubmitBtn(fixture);
        submitBtn.nativeElement.click();

        expect(component.isEditMode).toBe(false);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
          new ShoppingListActions.AddIngredient(ingredient)
        );
      })
    );
  });
});
