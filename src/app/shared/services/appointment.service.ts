import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {combineLatest, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointmentsCollection = this.db.collection('appointments');

  constructor(private db: AngularFirestore, private userService: UserService) {
  }

  create(date: Date): Observable<any> {
    const user = this.userService.getUser();
    return fromPromise(this.appointmentsCollection.add({
      uid: user.id,
      date
    }));
  }
}


// combineLatest([this.createAppointment$, this.userService.currentUser$])
//     .pipe(filter(([appointment, user]) => !!appointment && !!user))
//     .subscribe(async ([appointment, user]) => {
//       console.log(appointment, user);
//       await this.appointmentsCollection.add({
//         uid: user.id,
//         date: appointment
//       });
//     });
