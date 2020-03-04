import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggerService extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {
    const analytics = this.injector.get(AngularFireAnalytics);
    analytics.logEvent('[ErrorService]', {error});
  }
}
