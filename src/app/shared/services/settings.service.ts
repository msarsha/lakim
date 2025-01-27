import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {HoursMinutesPair, Settings, WorkingHours} from '../../models';
import {filter, first, map, shareReplay, take, tap} from 'rxjs/operators';
import {formatISO, setHours, setMinutes} from 'date-fns';

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
  private settingsBS = new BehaviorSubject(null);
  settings$ = this.settingsBS.asObservable()
      .pipe(tap((s) => {
      }), filter(settings => !!settings), shareReplay(1));

  workingHours$: Observable<WorkingHours> =
      this.settings$
          .pipe(
              take(1),
              map(settings => settings.workingHours),
              map(({from, to}: { from: HoursMinutesPair, to: HoursMinutesPair }) => {
                const today = new Date();
                const fromISO = this.applyUTCTimeToDate(today, from);
                const toISO = this.applyUTCTimeToDate(today, to);

                return {
                  from: fromISO,
                  to: toISO
                } as WorkingHours;
              })
          );

  private setWorkingHours$ = combineLatest([
    this.settings$
        .pipe(
            first(),
            take(1),
            map(settings => settings.workingHours)
        ),
    this.setWorkingHoursBS.asObservable()
  ])
      .pipe(
          tap(([workingHours, {pair, key}]) => {
            this.settingsDocument.update({
              workingHours: {...workingHours, [key]: pair}
            });
          })
      )
      .subscribe();

  constructor(private db: AngularFirestore) {
    this.settingsDocument
        .valueChanges()
        .pipe(
            tap((settings) => {
              this.settingsBS.next(settings);
            })
        ).subscribe();
  }

  getSettings(): Observable<Settings> {
    return this.settingsDocument.get()
        .pipe(
            map(ref => ref.data() as Settings)
        );
  }

  setAppointmentTime(time: number) {
    this.settingsDocument.update({appointmentTime: time});
  }

  setWorkingDays(days: number[]) {
    this.settingsDocument.update({workingDays: days});
  }

  setWorkingHours(isoDate: string, key: string) {
    const date = new Date(isoDate);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const pair = {hours, minutes};

    this.setWorkingHoursBS.next({pair, key});
  }

  private applyUTCTimeToDate(today: Date, pair: HoursMinutesPair): string {
    const asUTCTime = today.setUTCHours(Number(pair.hours), Number(pair.minutes));
    return new Date(asUTCTime).toISOString();
  }

  private timeToDate(time: string): Date {
    const [hours, minutes] = time.split(':');
    const today = new Date();
    const withHours = setHours(today, Number(hours));
    return setMinutes(withHours, Number(minutes));
  }
}
