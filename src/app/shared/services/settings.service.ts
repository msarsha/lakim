import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Settings} from '../../models';

export const days = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת'
];

export const hours = [
  15, 30, 45, 60
];

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settingsDocument = this.db
      .doc<Settings>('settings/schedule');

  settings$: Observable<Settings> = this.settingsDocument
      .valueChanges();

  constructor(private db: AngularFirestore) {
  }

  setAppointmentTime(time: number) {
    this.settingsDocument.update({appointmentTime: time});
  }

  setWorkingDays(days: number[]) {
    this.settingsDocument.update({workingDays: days});
  }
}
