import {Injectable} from '@angular/core';
import {format, addMinutes} from 'date-fns';
import {Observable, of} from 'rxjs';
import {HoursMinutesPair, Settings} from '../../models';
import {SettingsService} from './settings.service';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private settingsService: SettingsService) {
  }

  getAvailableSlots(interval: number): Observable<any> {
    return this.settingsService.settings$
        .pipe(
            switchMap((settings: Settings) => {
              return this
                  .buildWorkingHours(interval,
                      settings.workingHours.from as HoursMinutesPair,
                      settings.workingHours.to as HoursMinutesPair);
            })
        );

    return of([]);
  }

  private buildWorkingHours(interval: number, from: HoursMinutesPair, to: HoursMinutesPair): HoursMinutesPair[] {
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
