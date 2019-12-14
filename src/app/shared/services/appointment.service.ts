import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {ScheduleService} from './schedule.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointmentsCollection = this.db.collection('appointments');

  appointments$: Observable<any> = combineLatest([
    this.appointmentsCollection.snapshotChanges(),
    this.userService.currentUser$
  ])
      .pipe(map(([appointments, user]) => {
        if (!user || !user.appointments) {
          return [];
        }

        return appointments
            .filter(appointmentSnapshot => {
              const aid = appointmentSnapshot.payload.doc.id;
              return !!user.appointments[aid];
            })
            .map(appointmentSnapshot => appointmentSnapshot.payload.doc.data());
      }));

  constructor(private db: AngularFirestore,
              private userService: UserService,
              private scheduleService: ScheduleService) {
  }

  create(date: Date): Observable<any> {
    const user = this.userService.getUser();
    return fromPromise(this.appointmentsCollection.add({
      uid: user.id,
      date: date.getTime()
    }));
  }

  getAvailableAppointments(): Observable<any> {
    return this.scheduleService.getAvailableSlots(45);
  }
}
