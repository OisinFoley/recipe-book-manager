import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { take, exhaustMap, map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /*
      'take' combined with 'pipe' allows you to extract the first 'n' emitted values
        then immediately unsubscribe from future updates
      'exhaustMap' allows you to take an observable (authState.user) and return something else
        (i.e. - whatever we return from the exhaustMap function itself)
        even though you had a return statement directly in front of your initial observable
        (in the following snippet, our initial observable refers to this.store.select('auth'))
      In this code snippet, we observe the authenticated user, grabbing its current value immediately
        we add params to it, and return the updated request
        because we used 'take', we unsubscribed as soon as we extracted the value,
      Hence we're not interested in future updates unless we recall the interceptor
    */

    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token)
        });

        return next.handle(modifiedRequest);
      })
    );
  }
}
