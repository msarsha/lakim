import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import UserCredential = firebase.auth.UserCredential;
import {AngularFirestore} from '@angular/fire/firestore';
import {Customer} from '../../models';
import {UserService} from '../../shared/services/user.service';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userProfilesCollection = this.db.collection('user-profiles');

  constructor(private fbAuth: AngularFireAuth,
              private db: AngularFirestore,
              private userService: UserService) {
    this.fbAuth.user
        .pipe(
            switchMap((user: User) => {
              if (!user) {
                return of(null);
              }
              return this.userProfilesCollection.doc<Customer>(user.uid).valueChanges();
            })
        )
        .subscribe((user: Customer) => this.userService.setUser(user));
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
            } as Customer))
        );
  }

  login({email, password}): Observable<Customer> {
    return fromPromise(this.fbAuth.auth.signInWithEmailAndPassword(email, password))
        .pipe(
            switchMap((user: UserCredential) => {
              const id = user.user.uid;
              return this.userProfilesCollection.doc<Customer>(id).valueChanges();
            })
        );
  }

  logout(): Observable<any> {
    return fromPromise(this.fbAuth.auth.signOut());
  }
}
