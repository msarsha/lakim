import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import UserCredential = firebase.auth.UserCredential;
import {AngularFirestore} from '@angular/fire/firestore';
import {Customer} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userProfilesCollection = this.db.collection('user-profiles');

  constructor(private fbAuth: AngularFireAuth, private db: AngularFirestore) {
  }

  signup({name, email, password}): Observable<Customer> {
    return fromPromise(this.fbAuth.auth.createUserWithEmailAndPassword(email, password))
        .pipe(
            switchMap((user: UserCredential) => {
              const id = user.user.uid;
              return fromPromise(this.userProfilesCollection.doc(id).set({name, email, id}));
            }),
            map(() => ({
              name,
              email,
              id: ''
            } as Customer))
        );
  }
}
