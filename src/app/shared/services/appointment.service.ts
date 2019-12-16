import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {combineLatest, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {ScheduleService} from './schedule.service';
import {SettingsService} from './settings.service';
import {Settings} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointmentsCollection = this.db.collection('appointments');
  appointments$ = this.appointmentsCollection.snapshotChanges();

  appointmentsForUser$: Observable<any> = combineLatest([
    this.appointments$,
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
              private scheduleService: ScheduleService,
              private settingsService: SettingsService) {
  }

  scheduleAppointment(date: Date): Observable<any> {
    const user = this.userService.getUser();
    return this.settingsService.getWorkingHours()
        .pipe(switchMap((settings: Settings) => {
          return fromPromise(this.appointmentsCollection.add({
            uid: user.id,
            length: settings.appointmentTime,
            date: date.getTime()
          }));
        }));

  }

  getAvailableAppointments(month: number): Observable<any> {
    return this.scheduleService.getAvailableHours()
        .pipe(map((availableHours) => ({
          availableHours,
          daysInMonth: this.scheduleService.getDatesForMonth(month)
        })));
  }
}
