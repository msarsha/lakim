import {Component, Input, OnInit} from '@angular/core';
import {Costumer} from '../../../models';

@Component({
  selector: 'app-costumers-list-item',
  templateUrl: './costumers-list-item.component.html',
  styleUrls: ['./costumers-list-item.component.scss'],
})
export class CostumersListItemComponent implements OnInit {
  @Input() costumer: Costumer;
  constructor() { }

  ngOnInit() {}

}
