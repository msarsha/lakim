import {Injectable} from '@angular/core';
import {format, addMinutes, eachDayOfInterval, setMonth, addDays} from 'date-fns';
import {Observable} from 'rxjs';
import {HoursMinutesPair, Settings} from '../../models';
import {SettingsService} from './settings.service';
import {map} from 'rxjs/operators';
import {fromUTCWorkingHours} from '../date-helpers';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private settingsService: SettingsService) {
  }

  getWorkingHours(): Observable<HoursMinutesPair[]> {
    return this.settingsService.getSettings()
        .pipe(
            map((settings: Settings) => {
              const localHours = fromUTCWorkingHours(settings.workingHours);
              return this.buildWorkingHours(
                  settings.appointmentTime,
                  localHours.from as HoursMinutesPair,
                  localHours.to as HoursMinutesPair
              );
            })
        );
  }

  getDatesForMonth(month: number): Observable<Date[]> {
    const today = setMonth(new Date(), month);
    return this.settingsService.getSettings()
        .pipe(
            map(settings => settings.workingDays),
            map((workingDays) => {
              const twoMonthsDays = eachDayOfInterval({
                start: today,
                end: addDays(today, 60)
              });

              return twoMonthsDays
                  .filter(date => workingDays.some(workingDay => date.getDay() === workingDay));
            })
        );
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
    return (pair.hours as number * 60) + (pair.minutes as number);
  }
}
