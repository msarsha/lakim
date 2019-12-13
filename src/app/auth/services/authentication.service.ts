import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import UserCredential = firebase.auth.UserCredential;
import {AngularFirestore} from '@angular/fire/firestore';
import {Customer} from '../../models';
import {UserService} from '../../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userProfilesCollection = this.db.collection('user-profiles');

  constructor(private fbAuth: AngularFireAuth, private db: AngularFirestore, private userService: UserService) {
  }

  signup({name, email, password, phone}): Observable<Customer> {
    return fromPromise(this.fbAuth.auth.createUserWithEmailAndPassword(email, password))
        .pipe(
            switchMap((user: UserCredential) => {
              const id = user.user.uid;
              return fromPromise(this.userProfilesCollection.doc(id).set({name, email, id, phone}));
            }),
            map(() => ({
              name,
              email,
              id: ''
            } as Customer)),
            tap((customer) => {
              this.userService.setUser(customer);
            })
        );
  }

  login({email, password}): Observable<Customer> {
    return fromPromise(this.fbAuth.auth.signInWithEmailAndPassword(email, password))
        .pipe(
            switchMap((user: UserCredential) => {
              const id = user.user.uid;
              return this.userProfilesCollection.doc<Customer>(id).valueChanges();
            }),
            tap((customer) => {
              this.userService.setUser(customer);
            })
        );
  }

  logout(): Observable<any> {
    return fromPromise(this.fbAuth.auth.signOut())
        .pipe(
            tap(() => {
              this.userService.setUser(null);
            })
        );
  }
}
