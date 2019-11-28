import {Component, OnInit} from '@angular/core';
import {CostumersService} from '../costumers.service';

@Component({
  selector: 'app-costumers-list',
  templateUrl: './costumers-list.component.html',
  styleUrls: ['./costumers-list.component.scss'],
})
export class CostumersListComponent implements OnInit {
  approved$ = this
      .costumersService
      .approved$;

  waitingApproval$ = this
      .costumersService
      .waitingApproval$;

  constructor(private costumersService: CostumersService) {
  }

  ngOnInit() {
  }
}
