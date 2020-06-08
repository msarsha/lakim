import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {IonicModule} from '@ionic/angular';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ResetComponent} from './reset/reset.component';


@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetComponent],
  imports: [
    CommonModule,
    IonicModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule {
}
