import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {

  public map: number[];

  constructor(private translateService: TranslateService) {
    this.map = [1, 2, 3, 4, 5];
  }

  ngOnInit() {}

}
