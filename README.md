# RecipeBook Manager

Simple Angular app for visualising your favourite recipes and quickly managing your upcoming shopping list.  
Developed with the aid of [NgRx state management](https://ngrx.io/guide/store).

## Features

- Recipe Management: Build and modify your own catalogue of recipes, then save them to a database for later use.
- Shopping List: Ready to bake your favourite cake?  
You're going to need to do buy some groceries!  
Quickly add the required ingredients from a recipe to your shopping list, or just manually interact with your shopping list as you see fit!

## CLI Version

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Requirements

An env file at `src/environments/environment.ts` in the format:  
```
export const environment = {
  production: boolean,
  firebaseKey: string
};
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
