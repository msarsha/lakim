import {Injectable} from '@angular/core';
import {format, addMinutes} from 'date-fns';
import {Observable, of} from 'rxjs';
import {HoursMinutesPair} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor() {
  }

  getAvailableAppointments(interval: number): Observable<HoursMinutesPair[]> {
    const availableHours = this.buildWorkingHours(interval);
    return of(availableHours);
  }

  private buildWorkingHours(interval: number): HoursMinutesPair[] {
    const workingHours = [];
    const dateAtMidnight = new Date().setHours(0, 0, 0, 0);

    const today = new Date(dateAtMidnight);

    let currentDayAndTime = new Date(dateAtMidnight);

    const thisDay = today.getDay();
    let currentDay = today.getDay();

    while (thisDay === currentDay) {
      const hours = format(currentDayAndTime, 'HH');
      const minutes = format(currentDayAndTime, 'mm');
      workingHours.push({hours, minutes});

      currentDayAndTime = addMinutes(currentDayAndTime, interval);
      currentDay = currentDayAndTime.getDay();
    }

    return workingHours;
  }
}
