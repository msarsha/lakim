import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {AppointmentService} from '../../shared/services/appointment.service';
import {FormBuilder} from '@angular/forms';
import {set} from 'date-fns';
import {Appointment, HoursMinutesPair} from '../../models';
import {ScheduleService} from '../../shared/services/schedule.service';
import {Observable} from 'rxjs';
import {SwapService} from '../../shared/services/swap.service';

@Component({
  selector: 'app-select-appointment-modal',
  templateUrl: './select-appointment-modal.component.html',
  styleUrls: ['./select-appointment-modal.component.scss'],
})
export class SelectAppointmentModalComponent implements OnInit {
  availableDates$ = this.scheduleService.getDatesForMonth(new Date().getMonth());
  availableHoursForDate$ = this.appointmentService.availableHoursForDate$;
  allHoursForDate$ = this.appointmentService.allHoursForDate$;

  hoursForDisplay$: Observable<HoursMinutesPair[]>;

  form = this.fb.group({
    day: [''],
    time: [{value: '', disabled: true}]
  });

  private selectedPair: HoursMinutesPair;

  constructor(private modalCtrl: ModalController,
              private appointmentService: AppointmentService,
              private scheduleService: ScheduleService,
              private fb: FormBuilder,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private swapService: SwapService) {
  }

  ngOnInit() {
    const showALl = this.navParams.get('showAll');
    this.hoursForDisplay$ = showALl ? this.allHoursForDate$ : this.availableHoursForDate$;
  }

  close() {
    this.modalCtrl.dismiss(null);
  }

  onDayChanged($event: CustomEvent) {
    this.appointmentService.selectDateForAvailableHours($event.detail.value);
    this.form.get('time').enable();
  }

  onHourChanged($event: CustomEvent) {
    this.selectedPair = $event.detail.value;
  }

  get appointmentToSwap(): Appointment {
    return this.navParams.get('appointment');
  }

  async onSchedule() {
    if (!this.selectedPair) {
      return;
    }

    if (this.selectedPair.booked) {
      const alert = await this.alertCtrl.create({
        header: 'התור הנבחר תפוס',
        message: 'האם לשלוח בקשת החלפה?',
        buttons: [
          {
            text: 'בטל',
            role: 'cancel',
            handler: () => {
              console.log('Cancel');
            }
          }, {
            text: 'כן',
            handler: () => {
              this.swapService
                  .createSwap(this.appointmentToSwap, this.selectedPair as Appointment)
                  .subscribe(() => {
                    this.close();
                  });
            }
          }
        ]
      });

      await alert.present();
    } else {
      if (this.appointmentToSwap) {
        this.appointmentService.cancelAppointment(this.appointmentToSwap.id);
      }

      this.schedule();
    }
  }

  private schedule() {
    const {day, time: {hours, minutes}}: { day: Date, time: HoursMinutesPair } = this.form.value;
    const appointmentDate = set(day, {hours: hours as number, minutes: minutes as number});
    this.appointmentService.scheduleAppointment(appointmentDate)
        .subscribe(() => {
          this.close();
        });
  }
}
