import {Component, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';

@Component({
  selector: 'app-costumers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements OnInit {
  approved$ = this
      .costumersService
      .approved$;

  waitingApproval$ = this
      .costumersService
      .waitingApproval$;

  constructor(private costumersService: CustomersService) {
  }

  ngOnInit() {
  }
}
