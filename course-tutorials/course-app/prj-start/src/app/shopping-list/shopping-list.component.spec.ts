import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';

import { mockDefaultAppState, setTestProps } from 'src/app/shared/utils/test-helpers';
import { getShoppingListSeedData } from './store/shopping-list-helper';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as fromApp from 'src/app/store/app.reducer';

describe('ShoppingListComponent', () => {
  let store:                MockStore<fromApp.AppState>;
  let fixture:              ComponentFixture<ShoppingListComponent>;
  let component:            ShoppingListComponent;
  let componentHtmlElement: HTMLElement;
  let anchorElements:       DebugElement[];
  let clickItemIndex:       number;
  const populatedShoppingListState: fromShoppingList.State = {
    ...mockDefaultAppState.shoppingList,
    ingredients: getShoppingListSeedData()
  };
  const componentState: fromApp.AppState = {
    ...mockDefaultAppState,
    shoppingList: {...populatedShoppingListState}
  };

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule],
      declarations: [
        ShoppingListComponent,
        MockComponent(ShoppingEditComponent)
      ],
      providers: [
        provideMockStore({ initialState: { ...componentState } })
      ]
    }).compileComponents();

    ({ store, fixture, component, componentHtmlElement }
      = setTestProps(TestBed, ShoppingListComponent, ['router']));
    fixture.detectChanges();
    anchorElements = fixture.debugElement.queryAll(By.css('a'));
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('renders a number of anchor tags equivalent to those passed down as the state', async(() => {
    expect(anchorElements.length).toBe(populatedShoppingListState.ingredients.length);
  }));

  it('dispatches ShoppingListActions.StartEdit when an anchor tag from the list is clicked', async(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    clickItemIndex = 0;

    anchorElements[clickItemIndex].nativeElement.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new ShoppingListActions.StartEdit(clickItemIndex)
    );
  }));
});
