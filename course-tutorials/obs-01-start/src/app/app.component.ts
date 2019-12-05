import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  userActivated = false;
  private activatedSub: Subscription;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.activatedSub = this.userService.activatedEmitter.subscribe(didActivate => {
      this.userActivated = didActivate;
    });
  }

  ngOnDestroy() {
    // this ensures we don't have any memory leaks when we kill the component, and 
    // is also why we call this.activatedSub = this.userService.activatedEmitter.subscribe
    // instead of just this.userService.activatedEmitter.subscribe
    // i.e. - we have a reference to the subscription we created so that we can destroy it here when done
    this.activatedSub.unsubscribe();
  }
}
