import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { AlertMessage } from 'src/app/shared/interfaces/alert-message';
import { AlertHelper } from '../alert-helper.service';

@Component({
  selector: 'app-alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.css']
})
export class AlertNotificationComponent implements OnDestroy {
  @Input() messageInfo: AlertMessage;
  @Output() close = new EventEmitter<void>();
  private _alertDisplayTimeout: ReturnType<typeof setTimeout>;
  private _fadeOutAnimationTimer: ReturnType<typeof setTimeout>;

  constructor(private alertHelper: AlertHelper) {}

  ngOnInit() {
    this._initAlert(this.messageInfo);
  }

  private _initAlert(alertMessage: AlertMessage) {
    const { text, type } = alertMessage;

    this.alertHelper.initialiseNotificationMembers();
    this.alertHelper.setupWrapperStyling(type);
    this.alertHelper.setupIcons(type);
    this.alertHelper.setupText(text);

    this._setupFadeOutAnimation();
    this._setupAlertDisplayTimeout();
  }

  private _setupFadeOutAnimation() {
    this._fadeOutAnimationTimer =
      setTimeout(() => {
        this.alertHelper.setWrapperFadeOutAnimation();
      }, 3000);
  }

  private _setupAlertDisplayTimeout() {
    this._alertDisplayTimeout =
      setTimeout(() => {
        this._destroyAlert();
      }, 4000);
  }

  private _destroyAlert() {
    this.close.emit();
  }

  ngOnDestroy() {
    if (this._alertDisplayTimeout) {
      clearTimeout(this._alertDisplayTimeout);
    }
    if (this._fadeOutAnimationTimer) {
      clearTimeout(this._fadeOutAnimationTimer);
    }
  }
}
