import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ScheduleService} from '../../shared/services/schedule.service';
import {AppointmentService} from '../../shared/services/appointment.service';

@Component({
  selector: 'app-select-appointment-modal',
  templateUrl: './select-appointment-modal.component.html',
  styleUrls: ['./select-appointment-modal.component.scss'],
})
export class SelectAppointmentModalComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.appointmentService.getAvailableAppointments().subscribe(console.log);
  }

  close() {
    this.modalCtrl.dismiss(null);
  }
}
