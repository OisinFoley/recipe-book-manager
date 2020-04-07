import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /*
      'take' combined with 'pipe' allows you to extract the first 'n' emitted values
        then immediately unsubscribe from future updates
      'exhaustMap' allows you to take an observable (authService.user) and return something else
        (what's returned from the exhaustMap function)
        even though you had a return statement directly in front of your initial observable
        (return this.authService....)
      In this code snippet, we observe the authenticated user, grabbing its current value immediately
        we add params to it, and return the updated request
        because we used 'take', we unsubscribed as soon as we extracted the value,
      Hence we're not interested in future updates unless we recall the interceptor
    */

    return this.authService.user.pipe(
      take(1),
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
