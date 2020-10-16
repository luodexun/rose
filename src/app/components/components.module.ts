import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import {CardComponent} from "./card/card.component"
import {DirectivesModule} from "@directives/directives.module";
import {DividerComponent} from "./divider/divider.component";
import {PipesModule} from "@pipes/pipes.module";
import {SlideComponent} from "./slide/slide.component";
import { PlayerModule } from "@components/player/player.module";
@NgModule({
  declarations: [
    CardComponent,
    DividerComponent,
    SlideComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    PipesModule,
    PlayerModule
  ],
    exports: [
        CardComponent,
        DividerComponent,
        SlideComponent
    ]
})
export class ComponentsModule { }
