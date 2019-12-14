import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../shared/services/appointment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private appointmentService: AppointmentService) {
  }

  ngOnInit() {
  }

  createAppointment() {
    this.appointmentService.create(new Date());
  }
}
