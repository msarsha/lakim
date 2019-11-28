import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CostumersPage} from './costumers.page';
import {CostumersListComponent} from './costumers-list/costumers-list.component';
import {CostumersListItemComponent} from './costumers-list-item/costumers-list-item.component';
import {AngularFireModule} from '@angular/fire';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: CostumersPage}]),
    AngularFireModule
  ],
  declarations: [CostumersPage, CostumersListComponent, CostumersListItemComponent]
})
export class CostumersModule {
}
