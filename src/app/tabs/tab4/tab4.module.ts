import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PinCodeComponentModule } from "@components/pin-code/pin-code.module";
import { TranslateModule } from '@ngx-translate/core';
import { Tab4Page } from './tab4.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PinCodeComponentModule,
    RouterModule.forChild([{ path: '', component: Tab4Page }]),
    TranslateModule
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
