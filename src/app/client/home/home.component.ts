import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../shared/services/appointment.service';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {SelectAppointmentModalComponent} from '../select-appointment-modal/select-appointment-modal.component';
import {Appointment} from '../../models';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../shared/services/toast.service';
import {ToastTypes} from '../../shared/services/toast-types';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {

  appointments$ = this.appointmentService.appointmentsForUser$;

  constructor(private appointmentService: AppointmentService,
              private modalCtrl: ModalController,
              private actionSheetController: ActionSheetController,
              private datePipe: DatePipe,
              private toastService: ToastService
  ) {
  }

  ngOnInit() {
  }

  async createAppointment() {
    const modal = await this.modalCtrl.create({
      component: SelectAppointmentModalComponent
    });

    await modal.present();

    const {data} = await modal.onWillDismiss();
  }

  async openActions(appointment: Appointment) {
    if (!appointment.canCancel) {
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      header: `${this.datePipe.transform(appointment.date, 'EEE dd.MM.yyyy', null, 'he')} ${this.datePipe.transform(appointment.date, 'HH:mm', null, 'he')}`,
      buttons: [{
        text: 'בטל תור',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.appointmentService
              .cancelAppointment(appointment.id)
              .subscribe(() => {
                this.toastService.open(ToastTypes.APPOINTMENT_CANCELED);
              });
        }
      }, {
        text: 'סגור',
        icon: 'close',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }
}
