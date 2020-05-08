import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Constants } from '../shared/constants';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) authForm: NgForm;
  private _isLoginMode = true;
  private _isLoading = false;
  private _error = '';
  private _storeSub: Subscription;
  constants = Constants;
  email = '';

  get error(): string { return this._error; }
  set error(e: string) { this._error = e; }
  get isLoading(): boolean { return this._isLoading; }
  set isLoading(e: boolean) { this._isLoading = e; }
  get isLoginMode(): boolean { return this._isLoginMode; }
  set isLoginMode(e: boolean) { this._isLoginMode = e; }
  get storeSub(): Subscription { return this._storeSub; }

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this._storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
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

    form.reset({ 'email': this.email });
    if (this.isLoginMode) {
      return this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    }
    this.store.dispatch(new AuthActions.SignupStart({ email, password }));
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
