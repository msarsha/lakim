import {Component, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {Customer} from '../../../models';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-costumers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements OnInit {
  isIos = this.platform.is('ios') || this.platform.is('iphone');

  approved$ = this
      .costumersService
      .approved$;

  waitingApproval$ = this
      .costumersService
      .waitingApproval$;

  constructor(private costumersService: CustomersService,
              private platform: Platform) {
    console.log(this.isIos);
  }

  ngOnInit() {
  }

  approveCustomer(customer: Customer, approved: boolean) {
    this.costumersService.approve(customer.id, approved)
        .subscribe();
  }
}
