import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RecipeService } from './recipes/recipe.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  providers: [
     // TODO: add providedIn to these services' decorators then remove from this file
    //  they were added here for demonstrative purposes and other services are already using providedIn
    //  to make themselves known to the app
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})

export class CoreModule {}
