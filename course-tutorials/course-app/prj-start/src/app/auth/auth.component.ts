import { Component } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  constructor(private auth: AuthService, private router: Router) {}
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.auth.login(email, password);
    } else {
      authObs = this.auth.signup(email, password);
    }

    authObs.subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorResponse => {
        console.log(errorResponse);
        this.error = errorResponse;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  // onRegister() {
  //   this.auth.register();
  // }

  // onLogin() {
  //   this.auth.login();
  // }
}
