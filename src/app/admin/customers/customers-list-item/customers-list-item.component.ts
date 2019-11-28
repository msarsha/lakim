import {Component, Input, OnInit} from '@angular/core';
import {Costumer} from '../../../models';

@Component({
  selector: 'app-costumers-list-item',
  templateUrl: './customers-list-item.component.html',
  styleUrls: ['./customers-list-item.component.scss'],
})
export class CustomersListItemComponent implements OnInit {
  @Input() costumer: Costumer;
  constructor() { }

  ngOnInit() {}

}
