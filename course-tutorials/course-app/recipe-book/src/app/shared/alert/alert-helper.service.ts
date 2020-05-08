import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Alert } from './alert.enum';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AlertHelper {
  private _notificationWrapperDiv: HTMLElement;
  private _notificationIconSpan: HTMLElement;
  private _notificationTextSpan: HTMLElement;

  constructor(@Inject(DOCUMENT) private document: HTMLDocument) {}

  initialiseNotificationMembers() {
    this._notificationWrapperDiv = this.document.getElementById('notification-wrapper');
    this._notificationIconSpan = this.document.getElementById('notification-icon');
    this._notificationTextSpan = this.document.getElementById('notification-text');
  }

  setupWrapperStyling(type: string) {
    this._notificationWrapperDiv.classList.toggle(`alert-${type}`);
  }

  setupIcons(type: string) {
    const iconClass = this._getIconClassFromAlertType(type);
    this._notificationIconSpan.classList.toggle(iconClass, true);
  }

  setupText(text: string) {
    this._notificationTextSpan.innerText = text;
    this._notificationTextSpan.title = text;
  }

  setWrapperFadeOutAnimation() {
    this._notificationWrapperDiv.style.animation = Constants.fadeOutAnimationValue;
  }

  private _getIconClassFromAlertType(alertType: string): string {
    switch (alertType) {
      case Alert.danger:
        return Constants.glyphiconAlertClassName;
      case Alert.success:
        return Constants.glyphiconSavedClassName;
      case Alert.info:
      default:
        return Constants.glyphiconExclamationClassName;
    }
  }
}
