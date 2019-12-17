import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['chris', 'anna'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        // the scope of this does not follow normal JS patterns here
        // this is because Angular will take this code and call it from elsewhere when doing the validation
        // hence, the value of this as we know it in this class, would be lost
        // therefore, we must bind to this, so that we can access the list of names during execution
        'username': new FormControl(null,
          [Validators.required, this.forbiddenNames.bind(this)]),
        // we do not need to call .bind(this) on the email validator,
        // because it is ONLY being called from this component class
        // whereas, the forbiddenUsernames prop will be indirectly called by the template,
        // because the forbiddenNames() func will be invoked due to it be a FormControl
        // and that func then makes use of forbiddenNames prop, albeit with a diff context,
        // hence need for binding  for names validator above, but not below email validator below
        'email': new FormControl(null,
          [Validators.required, Validators.email], this.forbiddenEmails)
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });

    // built-in form Observables
    this.signupForm.valueChanges
      .subscribe((value) => {
        console.log(value);
    });
    // above subscriber is self-explanatory
    // the following is good way to see when form has moved from valid
    // to pending status (see forbiddenEmail() async validator) to invalid
    this.signupForm.statusChanges
      .subscribe((value) => {
        console.log(value);
    });

    // just like in template-driven approach
    // we can call setValue() and patchValue()
    this.signupForm.setValue({
      'userData': {
        'username': 'Oisin',
        'email': 'tessie@pugh.tk'
      },
      'gender': 'male',
      'hobbies': []
    });

    this.signupForm.patchValue({
      'userData': {
        'username': 'Oisin patch',
        'email': 'patch tessie@pugh.tk'
      },
      'gender': 'female',
      'hobbies': []
    });

    this.signupForm.patchValue({
      'userData': {
        'email': 'test@test.com'
      }
    });
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby() {
    const controls = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(controls);
  }

  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  forbiddenNames(control: FormControl): ({ [s: string]: boolean }) {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return { 'nameIsForbidden': true };
    }
    return null;
  }

  // an async validator
  forbiddenEmails(control:FormControl): Promise<any> | Observable<any> {
    return new Promise<any>(resolve => {
      setTimeout(() => {
        control.value === 'test@test.com'
        ? resolve({ emailIsForbidden: true})
        : resolve(null);
      }, 1500);
    });
  }
}
