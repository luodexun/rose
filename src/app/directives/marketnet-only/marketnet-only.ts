import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
	selector: "[appMarketNetOnly]",
})
export class MarketNetOnlyDirective implements OnInit {
	constructor(
		private elementRef: ElementRef,
	) {}

	ngOnInit() {
        this.elementRef.nativeElement.style.display = "none";
	}
}
