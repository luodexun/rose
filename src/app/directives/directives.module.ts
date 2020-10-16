import { NgModule } from "@angular/core";
import { HeaderScrollerDirective } from "./header-scroller/header-scroller";
import { MarketNetOnlyDirective } from "./marketnet-only/marketnet-only";
import { CenterDirective } from './img-center/center.directive';
import { HiddenDirective } from './hidden/hidden.directive';
import { PlayerDirective } from './status/player.directive';
import { DoubleDirective } from './hidden/double.directive';
@NgModule({
	declarations: [MarketNetOnlyDirective, HeaderScrollerDirective, CenterDirective, HiddenDirective, PlayerDirective, DoubleDirective],
	imports: [],
	exports: [MarketNetOnlyDirective, HeaderScrollerDirective,CenterDirective,HiddenDirective,PlayerDirective,DoubleDirective],
})
export class DirectivesModule {}
