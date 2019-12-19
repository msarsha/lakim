import {Component} from '@angular/core';
import {IEvent} from 'ionic2-calendar/calendar';
import {AppointmentService} from '../../shared/services/appointment.service';
import {EventSourceService} from './event-source.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'calendar.page.html',
    styleUrls: ['calendar.page.scss']
})
export class CalendarPage {
    today = new Date();
    selectedDate = new Date();
    title: string;

    eventSource$ = this.eventSourceService.eventSource$;

    constructor(private appointmentService: AppointmentService, private eventSourceService: EventSourceService) {
    }

    onEventSelected($event: IEvent) {
    }

    onTitleChanged($event: string) {
        this.title = $event;
        this.eventSourceService.setDate(this.selectedDate);
    }

    resetToday() {
        this.today = new Date();
    }

    onCurrentDateChanged($event: Date) {
        this.selectedDate = $event;
    }
}
