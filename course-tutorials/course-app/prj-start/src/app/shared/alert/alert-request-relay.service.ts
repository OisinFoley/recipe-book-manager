import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AlertMessage } from 'src/app/auth/interfaces/alert-message';

@Injectable({
  providedIn: 'root'
})
export class AlertRequestRelayService {
  readonly alertRequest: Subject<AlertMessage> = new Subject<AlertMessage>();

  relayNewAlertRequest(alertData: AlertMessage) {
    this.alertRequest.next(alertData);
  }
}
