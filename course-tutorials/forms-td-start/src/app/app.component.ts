import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('f', { static: true }) signupForm: NgForm;
  defaultQuestion = 'pet';
  answer = '';
  genders = ['male', 'female'];
  user = {
    username: '',
    email: '',
    secret: '',
    questionAnswer: '',
    gender: '',
  };
  submitted = false;

  suggestUserName() {
    const suggestedName = 'Superuser';

    // this can be used to set all values in a form at once
    // but it isn't working
    // to retry, view lecture 198
    // note: this will override all existing values in form, and you can only set all values, not specific ones
    // this.signupForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: ''
    //   },
    //   secret: 'pet',
    //   questionAnswer: '',
    //   gender: 'male'
    // });

    this.signupForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }


  // 1. alternative onSubmit(form: HTMLFormElement) {
    // -> just #f in template
  // 2. use of #f="ngForm"
  // -> onSubmit(form: NgForm) {
  //   console.log(form);
  // }

  // showing off use of viewchild
  onSubmit() {
    console.log(this.signupForm);
    this.submitted = true;
    this.user.username = this.signupForm.value.userData.username;
    this.user.email = this.signupForm.value.userData.email;
    this.user.secret = this.signupForm.value.secret;
    this.user.questionAnswer = this.signupForm.value.questionAnswer;
    this.user.gender = this.signupForm.value.gender;

    this.signupForm.reset();
  }

}
