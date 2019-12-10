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

  suggestUserName() {
    const suggestedName = 'Superuser';
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
  }

}
