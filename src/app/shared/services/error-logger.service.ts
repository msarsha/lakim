import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggerService extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {
    const db = this.injector.get(AngularFirestore);
    if (db) {
      const log = Object.keys(error)
          .filter(key => error.hasOwnProperty(key) && typeof (error[key]) === 'string' )
          .map(key => error[key]);
      db.collection('logs').add({log});
    }
  }
}
