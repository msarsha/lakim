import {Component} from '@angular/core';
import {SettingsService} from '../../shared/services/settings.service';
import {take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'schedule.page.html',
  styleUrls: ['schedule.page.scss']
})
export class SchedulePage {

  settings$ = this.settingsService.settings$
      .pipe(take(1));

  constructor(private settingsService: SettingsService) {
  }

  onAppointmentTimeChanged($event: CustomEvent) {
    const {value} = $event.detail;
    this.settingsService.setAppointmentTime(value);
  }
}
