import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSub: Subscription;
  private storeSub: Subscription;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(errorResponse: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    const hostViewContainer = this.alertHost.viewContainerRef;
    // destroys anything that may have been embedded earlier in the dynamic component container
    hostViewContainer.clear();

    const componentRef = hostViewContainer.createComponent(alertCmpFactory);
    componentRef.instance.message = errorResponse;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainer.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    this.storeSub.unsubscribe();
  }
}
