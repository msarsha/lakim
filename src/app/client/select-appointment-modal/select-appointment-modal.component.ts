import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AppointmentService} from '../../shared/services/appointment.service';

@Component({
  selector: 'app-select-appointment-modal',
  templateUrl: './select-appointment-modal.component.html',
  styleUrls: ['./select-appointment-modal.component.scss'],
})
export class SelectAppointmentModalComponent implements OnInit {

  availableAppointments$ = this.appointmentService
      .getAvailableAppointments(new Date().getMonth());

  constructor(private modalCtrl: ModalController,
              private appointmentService: AppointmentService) {
  }

  ngOnInit() {

  }

  close() {
    this.modalCtrl.dismiss(null);
  }

  onDayChanged($event: CustomEvent) {
    console.log($event);
  }
}
