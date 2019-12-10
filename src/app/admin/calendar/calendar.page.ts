import {Component} from '@angular/core';
import {addMinutes} from 'date-fns';
import {IEvent} from 'ionic2-calendar/calendar';

@Component({
  selector: 'app-tab1',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage {
  eventSource = [{
    title: 'יעל אוחנה',
    startTime: new Date(),
    endTime: addMinutes(new Date(), 45),
    id: 'test'
  }];

  today = new Date();
  title: string;

  constructor() {
  }

  onTimeChanged($event) {
    console.log($event);
  }

  onEventSelected($event: IEvent) {
    console.log($event);
  }

  onTitleChanged($event: string) {
    this.title = $event;
  }

  setToday() {
    this.today = new Date();
  }
}
