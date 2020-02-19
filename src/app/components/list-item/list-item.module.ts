import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from './list-item.component';
import {TranslateModule} from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
      ListItemComponent
  ],
  imports: [
    CommonModule,
      TranslateModule,
      IonicModule.forRoot()
  ],
  exports: [
      ListItemComponent
  ]
})
export class ListItemModule { }
