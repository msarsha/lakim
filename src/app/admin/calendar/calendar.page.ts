import {Component} from '@angular/core';
import {IEvent} from 'ionic2-calendar/calendar';
import {AppointmentService} from '../../shared/services/appointment.service';
import {EventSourceService} from './event-source.service';
import {ToastTypes} from '../../shared/services/toast-types';
import {ActionSheetController} from '@ionic/angular';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../shared/services/toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
  providers: [DatePipe]
})
export class CalendarPage {
  today = new Date();
  selectedDate = new Date();
  title: string;

  eventSource$ = this.eventSourceService.eventSource$;

  constructor(
      private appointmentService: AppointmentService,
      private eventSourceService: EventSourceService,
      private actionSheetController: ActionSheetController,
      private datePipe: DatePipe,
      private toastService: ToastService
  ) {
  }

  async onEventSelected($event: IEvent & { id: string }) {
    const actionSheet = await this.actionSheetController.create({
      header: `${this.datePipe.transform($event.startTime, 'EEE dd.MM.yyyy', null, 'he')} ${this.datePipe.transform($event.startTime, 'HH:mm', null, 'he')}`,
      buttons: [{
        text: 'בטל תור',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.appointmentService
              .cancelAppointment($event.id)
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

  onTitleChanged($event: string) {
    this.title = $event;
    this.eventSourceService.setDate(this.selectedDate);
  }

  resetToday() {
    this.today = new Date();
  }

  onCurrentDateChanged($event: Date) {
    this.selectedDate = $event;
  }
}
