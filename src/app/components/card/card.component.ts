import { Component, OnInit, Input} from '@angular/core';
import {Results} from "@models/api/goods"
@Component({
  selector: 'goods-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() item:Results;
  constructor() { }

  ngOnInit() {

  }

}
