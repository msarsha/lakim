import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {addMinutes} from 'date-fns';
import {AppointmentService} from '../../shared/services/appointment.service';

@Injectable({
    providedIn: 'root'
})
export class EventSourceService {
    private dateChangedBS = new Subject<Date>();

    eventSource$ = this.dateChangedBS
        .pipe(
            switchMap((date: Date) => {
                return this.appointmentService.getAppointmentsForMonth(date);
            }),
            map((appointments) =>
                appointments.map(appointment => ({
                    title: `${appointment.name}`,
                    startTime: new Date(appointment.date),
                    endTime: addMinutes(new Date(appointment.date), appointment.length || 30),
                    id: appointment.id
                })))
        );

    constructor(private appointmentService: AppointmentService) {
    }

    setDate(date: Date) {
        this.dateChangedBS.next(date);
    }
}
