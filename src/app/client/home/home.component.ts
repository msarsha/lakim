import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../shared/services/appointment.service';
import {ModalController} from '@ionic/angular';
import {SelectAppointmentModalComponent} from '../select-appointment-modal/select-appointment-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  appointments$ = this.appointmentService.appointments$;

  constructor(private appointmentService: AppointmentService,
              private modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  async createAppointment() {
    // this.appointmentService.create(new Date());
    const modal = await this.modalCtrl.create({
      component: SelectAppointmentModalComponent
    });


    await modal.present();

    const {data} = await modal.onWillDismiss();
    console.log(data);
  }
}
