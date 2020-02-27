import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../shared/services/appointment.service';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {SelectAppointmentModalComponent} from '../select-appointment-modal/select-appointment-modal.component';
import {Appointment, Customer} from '../../models';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../shared/services/toast.service';
import {ToastTypes} from '../../shared/services/toast-types';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './swaps.component.html',
  styleUrls: ['./swaps.component.scss'],
  providers: [DatePipe]
})
export class SwapsComponent implements OnInit {

  appointments$ = this.appointmentService.appointmentsForUser$;

  constructor(private appointmentService: AppointmentService,
              private modalCtrl: ModalController,
              private actionSheetController: ActionSheetController,
              private datePipe: DatePipe,
              private toastService: ToastService,
              private userService: UserService,
              private router: Router
  ) {
    userService.currentUser$
        .subscribe((user: Customer) => {
          if (user && user.isAdmin) {
            router.navigate(['admin']);
          }
        });
  }

  ngOnInit() {
  }

  async createAppointment(swap?: boolean, appointment?: Appointment): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: SelectAppointmentModalComponent,
      componentProps: {
        showAll: swap,
        appointment
      }
    });

    await modal.present();

    const {data} = await modal.onWillDismiss();
    return data;
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
        text: 'החלף תור',
        icon: 'swap',
        handler: () => {
          const data = this.createAppointment(true, appointment);
          console.log(data);
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
