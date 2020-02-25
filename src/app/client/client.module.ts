import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClientRoutingModule} from './client-routing.module';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {SharedModule} from '../shared/shared.module';
import {SelectAppointmentModalComponent} from './select-appointment-modal/select-appointment-modal.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
    IonicModule
  ],
  entryComponents: []
})
export class ClientModule {
}
