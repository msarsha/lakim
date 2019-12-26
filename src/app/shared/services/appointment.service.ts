import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {combineLatest, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {ScheduleService} from './schedule.service';
import {SettingsService} from './settings.service';
import {Appointment, Settings} from '../../models';
import {lastDayOfMonth, set, startOfMonth} from 'date-fns';
import {CustomersService} from '../../admin/customers/customers.service';

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

            const today = new Date().getTime();
            return appointments
                .filter(appointmentSnapshot => {
                    const aid = appointmentSnapshot.payload.doc.id;
                    const {date} = appointmentSnapshot.payload.doc.data() as any;

                    return date >= today && !!user.appointments[aid];
                })
                .map(appointmentSnapshot => appointmentSnapshot.payload.doc.data());
        }));

    constructor(private db: AngularFirestore,
                private userService: UserService,
                private scheduleService: ScheduleService,
                private settingsService: SettingsService,
                private customersService: CustomersService) {
    }

    scheduleAppointment(date: Date): Observable<any> {
        const {id, name, phone} = this.userService.getUser();
        return this.settingsService.getWorkingHours()
            .pipe(switchMap((settings: Settings) => {
                return fromPromise(this.appointmentsCollection.add({
                    uid: id,
                    phone,
                    name,
                    length: settings.appointmentTime,
                    date: date.getTime()
                }));
            }));

    }

    getAppointmentsForMonth(date: Date): Observable<Appointment[]> {
        const firstDayOfMonthEpoch = startOfMonth(date).getTime();
        const lastDayOfMonthEpoch = lastDayOfMonth(date).getTime();
        return this.db
            .collection<Appointment>('appointments',
                ref => ref
                    .where('date', '>=', firstDayOfMonthEpoch)
                    .where('date', '<=', lastDayOfMonthEpoch))
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

    getAvailableAppointments(month: number): Observable<any> {
        return this.scheduleService.getAvailableHours()
            .pipe(map((availableHours) => ({
                availableHours,
                daysInMonth: this.scheduleService.getDatesForMonth(month)
            })));
    }
}
