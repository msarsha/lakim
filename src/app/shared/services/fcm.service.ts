import {Injectable} from '@angular/core';

import {FCM} from 'capacitor-fcm';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const {PushNotifications} = Plugins;
const fcm = new FCM();

@Injectable({
  providedIn: 'root'
})
export class FCMProvider {

  constructor() {
    this.initNotifications();
  }

  getToken(): Observable<string> {
    return fromPromise(fcm.getToken())
        .pipe(map(res => res.token));
  }

  private initNotifications(): void {
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          console.log('Push registration success, token: ' + token.value);
        }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
        (error: any) => {
          console.log('Error on registration: ' + JSON.stringify(error));
        }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          console.log('Push received: ' + JSON.stringify(notification));
        }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          console.log('Push action performed: ' + JSON.stringify(notification));
        }
    );
  }
}
