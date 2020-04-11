import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://angular-course-app-e750b.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(
      'https://angular-course-app-e750b.firebaseio.com/recipes.json'
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap(recipes => {
        console.log(recipes);
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}