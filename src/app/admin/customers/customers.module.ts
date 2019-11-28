import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CustomersPage} from './customers.page';
import {CustomersListComponent} from './customers-list/customers-list.component';
import {CustomersListItemComponent} from './customers-list-item/customers-list-item.component';
import {AngularFireModule} from '@angular/fire';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: CustomersPage}]),
    AngularFireModule
  ],
  declarations: [CustomersPage, CustomersListComponent, CustomersListItemComponent]
})
export class CustomersModule {
}
