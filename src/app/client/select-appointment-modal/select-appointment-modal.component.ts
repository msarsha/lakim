import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AppointmentService} from '../../shared/services/appointment.service';
import {FormBuilder} from '@angular/forms';
import {set} from 'date-fns';
import {HoursMinutesPair} from '../../models';
import {ScheduleService} from '../../shared/services/schedule.service';

@Component({
  selector: 'app-select-appointment-modal',
  templateUrl: './select-appointment-modal.component.html',
  styleUrls: ['./select-appointment-modal.component.scss'],
})
export class SelectAppointmentModalComponent implements OnInit {
  availableDates$ = this.scheduleService.getDatesForMonth(new Date().getMonth());
  availableHoursForDate$ = this.appointmentService.availableHoursForDate$;

  form = this.fb.group({
    day: [''],
    time: [{value: '', disabled: true}]
  });

  constructor(private modalCtrl: ModalController,
              private appointmentService: AppointmentService,
              private scheduleService: ScheduleService,
              private fb: FormBuilder) {
  }

  ngOnInit() {

  }

  close() {
    this.modalCtrl.dismiss(null);
  }

  onDayChanged($event: CustomEvent) {
    this.appointmentService.selectDateForAvailableHours($event.detail.value);
    this.form.get('time').enable();
  }

  onHourChanged($event: CustomEvent) {

  }

  schedule() {
    const {day, time: {hours, minutes}}: { day: Date, time: HoursMinutesPair } = this.form.value;
    const appointmentDate = set(day, {hours: hours as number, minutes: minutes as number});
    this.appointmentService.scheduleAppointment(appointmentDate)
        .subscribe(() => {
          this.close();
        });
  }
}
