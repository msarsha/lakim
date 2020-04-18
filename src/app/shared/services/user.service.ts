import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Customer} from '../../models';
import {FCMProvider} from './fcm.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {catchError, switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserBS = new BehaviorSubject(null);
  currentUser$ = this.currentUserBS.asObservable();

  constructor(private fcm: FCMProvider, private db: AngularFirestore) {
  }

  setUser(user: Customer) {
    this.currentUserBS.next(user);
  }

  getUser(): Customer {
    return this.currentUserBS.getValue();
  }

  removeCurrentDevice(): Observable<any> {
    return this.fcm.getToken()
        .pipe(
            switchMap((token) => {
              const user = this.getUser();
              const filteredDevices = user.devices.filter(device => device !== token);
              return fromPromise(
                  this.db.doc(`user-profiles/${user.id}`)
                      .update({devices: filteredDevices})
              );
            }),
            catchError((err) => {
              return of(null);
            })
        );
  }
}
