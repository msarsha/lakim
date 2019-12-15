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
