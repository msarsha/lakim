import {Component} from '@angular/core';
import {addMinutes, set} from 'date-fns';
import {IEvent} from 'ionic2-calendar/calendar';
import {AppointmentService} from '../../shared/services/appointment.service';
import {Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage {
  today = new Date();
  selectedDate = new Date();
  title: string;
  dateChangedBS = new Subject<Date>();

  eventSource$ = this.dateChangedBS
      .pipe(
          switchMap((date: Date) => {
            return this.appointmentService.getAppointmentsForMonth(date);
          }),
          map((appointments) =>
              appointments.map(appointment => ({
                title: ` תור${appointment.date}`,
                startTime: new Date(appointment.date),
                endTime: addMinutes(new Date(appointment.date), appointment.length || 30),
                id: new Date(appointment.date).getTime().toString()
              })))
      );

  constructor(private appointmentService: AppointmentService) {
    this.eventSource$.subscribe();
  }


  onEventSelected($event: IEvent) {
  }

  onTitleChanged($event: string) {
    this.title = $event;
    this.dateChangedBS.next(this.selectedDate);
  }

  resetToday() {
    this.today = new Date();
  }

  onCurrentDateChanged($event: Date) {
    this.selectedDate = $event;
  }
}
