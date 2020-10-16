import { Component, Input, ElementRef, Renderer2, AfterViewInit } from "@angular/core";

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
})
export class DividerComponent implements AfterViewInit {
   @Input() private origin = "w";
   @Input() private size=1;
   @Input() private color="#eeeeee";
  constructor(private el:ElementRef,private renderer: Renderer2) { }

  ngAfterViewInit() {
           this.renderer.setStyle(this.el.nativeElement.querySelector('div'),this.origin==="w"?"height":"width",`${this.size}px`);
           this.renderer.setStyle(this.el.nativeElement.querySelector('div'),'background-color',this.color)
  }

}
