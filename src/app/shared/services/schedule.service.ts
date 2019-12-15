import {Injectable} from '@angular/core';
import {format, addMinutes, eachDayOfInterval, startOfMonth, lastDayOfMonth, setMonth} from 'date-fns';
import {Observable, of} from 'rxjs';
import {HoursMinutesPair, Settings} from '../../models';
import {SettingsService} from './settings.service';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private settingsService: SettingsService) {
  }

  getAvailableHours(): Observable<HoursMinutesPair[]> {
    return this.settingsService.getWorkingHours()
        .pipe(
            map((settings: Settings) => {
              return this.buildWorkingHours(settings.appointmentTime,
                  settings.workingHours.from as HoursMinutesPair,
                  settings.workingHours.to as HoursMinutesPair);
            })
        );
  }

  getDatesForMonth(month: number): Date[] {
    const today = setMonth(new Date(), month);
    return eachDayOfInterval({
      start: startOfMonth(today),
      end: lastDayOfMonth(today)
    });
  }

  private buildWorkingHours(interval: number, from: HoursMinutesPair, to: HoursMinutesPair): HoursMinutesPair[] {
    const workingHours = [];
    const dateAtMidnight = new Date().setHours(0, 0, 0, 0);

    const today = new Date(dateAtMidnight);

    let currentDayAndTime = new Date(dateAtMidnight);

    const thisDay = today.getDay();
    let nextDay = today.getDay();

    while (thisDay === nextDay) {
      const hours = format(currentDayAndTime, 'HH');
      const minutes = format(currentDayAndTime, 'mm');

      if (this.isBetween({hours: Number(hours), minutes: Number(minutes)}, from, to)) {
        workingHours.push({hours, minutes});
      }

      currentDayAndTime = addMinutes(currentDayAndTime, interval);
      nextDay = currentDayAndTime.getDay();
    }

    return workingHours;
  }

  private isBetween(param: HoursMinutesPair, from: HoursMinutesPair, to: HoursMinutesPair): boolean {
    const fromMinutes = this.toMinutes(from);
    const toMinutes = this.toMinutes(to);
    const pairMinutes = this.toMinutes(param);

    return (pairMinutes >= fromMinutes && pairMinutes <= toMinutes);
  }

  private toMinutes(pair: HoursMinutesPair): number {
    return (pair.hours * 60) + pair.minutes;
  }
}
