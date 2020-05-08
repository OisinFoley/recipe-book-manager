import { Injectable } from '@angular/core';

import { AlertRequestRelayService } from './alert-request-relay.service';
import { Alert } from './alert.enum';

@Injectable({
  providedIn: 'root'
})
export class AlertRequestInitialiser {
  constructor(
    private alertRequestRelayService: AlertRequestRelayService
  ) {}

  init(alertText: string, type: Alert) {
    this.alertRequestRelayService.relayNewAlertRequest({
      text: alertText,
      type
    });
  }
}
