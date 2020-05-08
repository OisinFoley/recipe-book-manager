import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

import { RecipeItemComponent } from './recipe-item.component';
import { mockRecipeData } from 'src/app/recipes/store/recipe-helper';
import { Recipe } from 'src/app/recipes/models/recipe.model';
import { setTestProps } from 'src/app/shared/utils/test-helpers';

describe('RecipeItemComponent', () => {
  let fixture:              ComponentFixture<RecipeItemComponent>;
  let component:            RecipeItemComponent;
  let componentHtmlElement: HTMLElement;
  let mockRecipes:          Recipe[];
  let index:                number;

  afterAll(() => {
    if (fixture) {
      componentHtmlElement.remove();
    }
  });

  beforeEach(() => {
    mockRecipes = mockRecipeData;
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      declarations: [RecipeItemComponent],
      providers: []
    });
    ({ fixture, component, componentHtmlElement }
      = setTestProps(TestBed, RecipeItemComponent, ['store', 'router']));
    index = 0;
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  /* TODO: use a 'Page Object Model' test class to encapsulate accessing and interacting
      with class props and DOM elements separately
      away from the test itself: https://angular.io/guide/testing#use-a-page-object
  */
  it(`should have 'recipe' and 'index' @Input members, and the template's props should
      match those that were passed in via the @Input members (title, description, image src & alt, routerLink)`,
      async(() => {
        component.recipe = mockRecipes[index];
        component.index = index;
        fixture.detectChanges();

        const title:       DebugElement = fixture.debugElement.query(By.css('h4'));
        const description: DebugElement = fixture.debugElement.query(By.css('p'));
        const image:       DebugElement = fixture.debugElement.query(By.css('img'));
        const anchorEl:    DebugElement = fixture.debugElement.query(By.css(`a[href*="/${index}"]`));

        expect(title.nativeElement.textContent.trim()).toEqual(mockRecipes[index].name);
        expect(description.nativeElement.textContent.trim()).toEqual(mockRecipes[index].description);
        expect(image.nativeElement.src).toEqual(mockRecipes[index].imagePath);
        expect(image.nativeElement.alt).toEqual(mockRecipes[index].name);
        expect(anchorEl).toBeTruthy();
      })
  );
});
