import {Component} from '@angular/core';
import {days, hours, SettingsService} from '../../shared/services/settings.service';
import {take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Settings} from '../../models';

@Component({
  selector: 'app-tab2',
  templateUrl: 'schedule.page.html',
  styleUrls: ['schedule.page.scss']
})
export class SchedulePage {

  availableDays = days;
  availableHours = hours;

  settings$: Observable<Settings> = this.settingsService.settings$
      .pipe(take(1));

  constructor(private settingsService: SettingsService) {
  }

  onAppointmentTimeChanged($event: CustomEvent) {
    const {value} = $event.detail;
    this.settingsService.setAppointmentTime(value);
  }

  onAppointmentDaysChanged($event: CustomEvent) {
    const {value} = $event.detail;
    this.settingsService.setWorkingDays(value);
  }
}
