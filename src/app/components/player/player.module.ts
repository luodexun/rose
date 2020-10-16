import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { PlayerComponent } from "./player.component";
import {VideoComponent} from "./video/video.component";
import {ControlsComponent} from "./controls/controls.component";
import {PlayComponent} from "./play/play.component"
import {PlayerService} from "./services/player.service";
@NgModule({
  declarations: [
    PlayerComponent,
    VideoComponent,
    ControlsComponent,
    PlayComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports:[
    PlayerComponent,
    VideoComponent,
    ControlsComponent,
    PlayComponent
  ],
  providers:[
    PlayerService
  ]
})
export class PlayerModule { }
