import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPage} from './tabs.page';
import {HomeComponent} from '../home/home.component';
import {SelectAppointmentModalComponent} from '../select-appointment-modal/select-appointment-modal.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [TabsPage, HomeComponent, SelectAppointmentModalComponent],
  entryComponents: [SelectAppointmentModalComponent]
})
export class TabsPageModule {
}
