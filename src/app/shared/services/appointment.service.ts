import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {ScheduleService} from './schedule.service';
import {SettingsService} from './settings.service';
import {Appointment, HoursMinutesPair, Settings} from '../../models';
import {endOfDay, format, isBefore, lastDayOfMonth, set, startOfDay, startOfMonth, subHours} from 'date-fns';

const HOURS_DISTANCE_TO_CANCEL = 8;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private selectedDateForAvailableHoursBS = new Subject<Date>();
  private appointmentsCollection = this.db.collection('appointments',
      ref => ref
          .where('date', '>=', new Date().getTime()));

  appointments$ = this.appointmentsCollection.snapshotChanges();

  allHoursForDate$: Observable<HoursMinutesPair[]> = combineLatest([
    this.selectedDateForAvailableHoursBS
        .asObservable()
        .pipe(
            switchMap((date) => {
              return this.getAppointmentsForDay(date);
            }),
            map((appointments: Appointment[]) => appointments.map((appointment) => {
              const date = new Date(appointment.date);
              const hours = format(date, 'HH');
              const minutes = format(date, 'mm');
              return {minutes, hours, ...appointment} as HoursMinutesPair;
            }))
        ),
    this.scheduleService.getWorkingHours()
  ]).pipe(
      map(([takenAppointments, availableHours]) => {
        return availableHours.map(
            (availablePair) => {
              let obj = {};
              const bookedAppointment = takenAppointments.find(
                  takenPair => availablePair.hours === takenPair.hours && availablePair.minutes === takenPair.minutes
              );

              if (bookedAppointment) {
                obj = bookedAppointment;
              }

              return {...availablePair, booked: !!bookedAppointment, ...obj};
            });
      })
  );

  availableHoursForDate$: Observable<HoursMinutesPair[]> = this.allHoursForDate$
      .pipe(
          map(allHours => allHours.filter(pair => !pair.booked))
      );

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
            .map(appointmentSnapshot => {
              const appointment = appointmentSnapshot.payload.doc.data() as Appointment;
              return {
                ...appointment,
                id: appointmentSnapshot.payload.doc.id,
                canCancel: this.canCancelAppointment(new Date(appointment.date))
              };
            });
      }));

  constructor(private db: AngularFirestore,
              private userService: UserService,
              private scheduleService: ScheduleService,
              private settingsService: SettingsService) {
  }

  private getAppointmentsForDay(date: Date): Observable<Appointment[]> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    return this.getAppointmentsForRange(startOfDate, endOfDate);
  }

  scheduleAppointment(date: Date): Observable<any> {
    const {id, name, phone} = this.userService.getUser();
    return this.settingsService.getSettings()
        .pipe(switchMap((settings: Settings) => {
          return fromPromise(this.appointmentsCollection.add({
            uid: id,
            phone,
            name,
            length: settings.appointmentTime,
            date: date.getTime(),
            timeZoneOffset: date.getTimezoneOffset()
          }));
        }));
  }

  cancelAppointment(id: string): Observable<any> {
    return fromPromise(this.appointmentsCollection.doc(id).delete());
  }

  getAppointmentsForMonth(date: Date): Observable<Appointment[]> {
    const firstDayOfMonthEpoch = startOfMonth(date);
    const lastDayOfMonthEpoch = lastDayOfMonth(date);

    return this.getAppointmentsForRange(firstDayOfMonthEpoch, lastDayOfMonthEpoch);
  }

  selectDateForAvailableHours(date: Date) {
    this.selectedDateForAvailableHoursBS.next(date);
  }

  private getAppointmentsForRange(from: Date, to: Date): Observable<Appointment[]> {
    return this.db
        .collection<Appointment>('appointments',
            ref => ref
                .where('date', '>=', from.getTime())
                .where('date', '<=', to.getTime()))
        .snapshotChanges()
        .pipe(
            map((snapshots) => {
              return snapshots.map((snap) => {
                return {
                  id: snap.payload.doc.id,
                  ...snap.payload.doc.data()
                } as Appointment;
              });
            })
        );
  }

  private canCancelAppointment(date: Date) {
    const allowedTimeToCancel = subHours(date, HOURS_DISTANCE_TO_CANCEL);
    const now = new Date();
    return isBefore(now, allowedTimeToCancel);
  }
}
