import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'observable-async-sample';

  time = new Observable<string>((observer: Observer<string>) => {
    // setInterval(() => observer.next(new Date().toString() + new Date().getUTCMilliseconds().toString()), 100);
    setInterval(() => observer.next(new Date().toISOString().toString()), 100);
  });
}
