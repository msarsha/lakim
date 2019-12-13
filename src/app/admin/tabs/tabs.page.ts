import {Component} from '@angular/core';
import {CustomersService} from '../customers/customers.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  numberOfWaitingApproval$ = this.customersService.waitingApproval$
      .pipe(map(customers => customers.length));

  constructor(private customersService: CustomersService) {
  }

}
