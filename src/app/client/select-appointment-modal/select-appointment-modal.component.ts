import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AppointmentService} from '../../shared/services/appointment.service';
import {FormBuilder} from '@angular/forms';
import {set} from 'date-fns';
import {HoursMinutesPair} from '../../models';

@Component({
  selector: 'app-select-appointment-modal',
  templateUrl: './select-appointment-modal.component.html',
  styleUrls: ['./select-appointment-modal.component.scss'],
})
export class SelectAppointmentModalComponent implements OnInit {
  availableAppointments$ = this.appointmentService
      .getAvailableAppointments(new Date().getMonth());

  form = this.fb.group({
    day: [''],
    time: ['']
  });

  constructor(private modalCtrl: ModalController,
              private appointmentService: AppointmentService,
              private fb: FormBuilder) {
  }

  ngOnInit() {

  }

  close() {
    this.modalCtrl.dismiss(null);
  }

  onDayChanged($event: CustomEvent) {
    console.log($event);
  }

  onHourChanged($event: CustomEvent) {
    console.log($event);
  }

  schedule() {
    const {day, time: {hours, minutes}}: { day: Date, time: HoursMinutesPair } = this.form.value;
    const appointmentDate = set(day, {hours, minutes});
    this.appointmentService.scheduleAppointment(appointmentDate)
        .subscribe(() => {
          this.close();
        });
  }
}
