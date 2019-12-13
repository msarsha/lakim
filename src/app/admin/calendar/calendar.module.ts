import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CalendarPage} from './calendar.page';
import {NgCalendarModule} from 'ionic2-calendar';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: CalendarPage}]),
    NgCalendarModule,
    SharedModule
  ],
  declarations: [CalendarPage]
})
export class CalendarModule {
}
