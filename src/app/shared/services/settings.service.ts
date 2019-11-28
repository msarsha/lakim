import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Settings} from '../../models';
import {fromPromise} from 'rxjs/internal-compatibility';

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
    this.settingsDocument.update({appointment_time: time});
  }
}
