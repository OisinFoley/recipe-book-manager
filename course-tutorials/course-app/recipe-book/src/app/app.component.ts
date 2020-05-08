import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import { AlertNotificationComponent } from './shared/alert/alert-notification/alert-notification.component';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { AlertRequestRelayService } from './shared/alert/alert-request-relay.service';
import { AlertMessage } from './shared/interfaces/alert-message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private _closeComponentSub: Subscription;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  get closeComponentSub(): Subscription { return this._closeComponentSub; }
  set closeComponentSub(e: Subscription) { this._closeComponentSub = e; }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private alertRequestRelayService: AlertRequestRelayService,
    private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new AuthAction.AutoLogin());
    }

    this.alertRequestRelayService.alertRequest
      .subscribe((alertRequest: AlertMessage) => {
        this._showAlert(alertRequest);
      });
  }

  private _showAlert(alertRequest: AlertMessage) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertNotificationComponent
    );

    const hostViewContainer = this.alertHost.viewContainerRef;
    // destroys anything that may have been embedded earlier in the dynamic component container
    hostViewContainer.clear();

    const componentRef = hostViewContainer.createComponent(alertCmpFactory);
    componentRef.instance.messageInfo = alertRequest;
    this.closeComponentSub = componentRef.instance.close
      .subscribe(() => {
        this.closeComponentSub.unsubscribe();
        hostViewContainer.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeComponentSub) {
      this.closeComponentSub.unsubscribe();
    }
  }
}
