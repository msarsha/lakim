import {Component} from '@angular/core';
import {weekDays, timeIntervals, SettingsService} from '../../shared/services/settings.service';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Settings} from '../../models';
import {ScheduleService} from '../../shared/services/schedule.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'schedule.page.html',
  styleUrls: ['schedule.page.scss']
})
export class SchedulePage {
  availableDays = weekDays;
  availableTimeIntervals = timeIntervals;

  workingDays$: Observable<number[]> = this.settingsService
      .settings$
      .pipe(map(settings => settings.workingDays));

  workingHours$ = this.settingsService.workingHours$;

  appointmentTime$: Observable<number> = this.settingsService.settings$
      .pipe(
          map(settings => settings.appointmentTime),
          distinctUntilChanged()
      );

  vm$ = combineLatest([this.workingDays$, this.workingHours$, this.appointmentTime$])
      .pipe(
          map(([workingDays, workingHours, appointmentTime]) => ({
            workingDays,
            workingHours,
            appointmentTime
          }))
      );

  constructor(private settingsService: SettingsService, private scheduleService: ScheduleService) {
  }

  onAppointmentTimeChanged($event: CustomEvent) {
    const {value} = $event.detail;
    this.settingsService.setAppointmentTime(value);
  }

  onAppointmentDaysChanged($event: CustomEvent) {
    const {value} = $event.detail;
    this.settingsService.setWorkingDays(value);
  }

  onFromChanged($event: CustomEvent) {
    const {value} = $event.detail;
    this.settingsService.setWorkingHours(value, 'from');
  }

  onToChanged($event: CustomEvent) {
    const {value} = $event.detail;
    this.settingsService.setWorkingHours(value, 'to');
  }
}
