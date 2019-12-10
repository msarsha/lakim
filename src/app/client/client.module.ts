import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import {LoginComponent} from '../auth/login/login.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    IonicModule
  ]
})
export class ClientModule { }
