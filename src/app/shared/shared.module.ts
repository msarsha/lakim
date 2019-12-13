import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LakimHeaderComponent} from './lakim-header/lakim-header.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [LakimHeaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [LakimHeaderComponent]
})
export class SharedModule {
}
