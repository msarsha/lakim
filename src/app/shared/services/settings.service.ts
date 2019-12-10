import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {HoursMinutesPair, Settings, WorkingHours} from '../../models';
import {map, take, tap} from 'rxjs/operators';
import {formatISO, getHours, getMinutes, setHours, setMinutes} from 'date-fns';

export const weekDays = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת'
];

export const timeIntervals = [
  15, 30, 45, 60
];

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settingsDocument = this.db
      .doc<Settings>('settings/schedule');

  private setWorkingHoursBS = new Subject<any>();

  settings$: Observable<Settings> = this.settingsDocument
      .valueChanges();

  workingHours$: Observable<WorkingHours> = this.settings$
      .pipe(
          map(settings => settings.workingHours),
          map(({from, to}: { from: HoursMinutesPair, to: HoursMinutesPair }) => {
            const today = new Date();
            const fromISO = this.setHoursAndMinutes(today, from);
            const toISO = this.setHoursAndMinutes(today, to);

            return {
              from: fromISO,
              to: toISO
            } as WorkingHours;
          })
      );

  private setWorkingHours$ = combineLatest([
    this.settings$.pipe(map(settings => settings.workingHours)),
    this.setWorkingHoursBS.asObservable()
  ])
      .pipe(tap(([workingHours, {pair, key}]) => {
        this.settingsDocument.update({
          workingHours: {...workingHours, [key]: pair}
        });
      })).subscribe();

  constructor(private db: AngularFirestore) {
  }

  setAppointmentTime(time: number) {
    this.settingsDocument.update({appointmentTime: time});
  }

  setWorkingDays(days: number[]) {
    this.settingsDocument.update({workingDays: days});
  }

  setWorkingHours(isoDate: string, key: string) {
    const date = new Date(isoDate);
    const hours = getHours(date);
    const minutes = getMinutes(date);
    const pair = {hours, minutes};

    this.setWorkingHoursBS.next({pair, key});
  }

  private setHoursAndMinutes(today: Date, pair: HoursMinutesPair): string {
    const withHours = setHours(today, pair.hours);
    const withMinutes = setMinutes(withHours, pair.minutes);
    return formatISO(withMinutes);
  }
}
