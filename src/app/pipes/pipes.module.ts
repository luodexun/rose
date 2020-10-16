import { NgModule } from "@angular/core";
import { DomainPipe } from './domain/domain.pipe';

@NgModule({
	declarations: [DomainPipe],
	imports: [],
	exports: [
		DomainPipe
	],
})
export class PipesModule {}
