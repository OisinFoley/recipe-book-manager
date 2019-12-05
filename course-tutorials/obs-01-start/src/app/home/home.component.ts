import { Component, OnInit } from '@angular/core';
import { interval, Subscription, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private firstObsSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    // built-in util observable
    // this.firstObsSubscription = interval(1000).subscribe(count => {
    //   console.log(count);
    // })

    const customObservable = Observable.create(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        // if (count === 2) observer.complete();

        // when an observer errors, it cancels, hence no further values,
        // but we don't see out finally 'block-like' complete log from below
        if (count > 3) observer.error(new Error('count cannot be more than 3'));
        
        count++;
      }, 1000);
    });

    // from .subscribe onward, the call stack is similar to a try catch finally 
    // but the finally doesn't execute if we encounter an error
    // pipe offers a way to prevent certain values from making it through to the observer,
    // a form of validation
    // map is a way to format the data being sent by the observable before it reaches the observer
    // pipe and map are known as rxjs 'operators', of which there are more
    this.firstObsSubscription = customObservable.pipe(filter(data => {
      // return true;
      return +data % 2 === 0;
    }), map((data: number) => {
      return `Round: ${data + 1}`;
    })).subscribe(count => {
      console.log(count);
    }, error => {
      console.log('error');
      // alert(error.message);
    }, () => {
      console.log('observer complete');
    })

    // you should only use subjects to commuinicate across components, through services

  }

  ngOnDestroy(): void {
    this.firstObsSubscription.unsubscribe();
  }

}
