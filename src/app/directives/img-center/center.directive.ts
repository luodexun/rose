import { Directive, ElementRef,HostListener, Input, AfterViewInit,AfterContentChecked, Renderer2 } from "@angular/core";
import { DomController } from "@ionic/angular";
@Directive({
  selector: "[appCenter]"
})
export class CenterDirective implements AfterViewInit{
  @Input("appCenter") public src:string;
  @HostListener("click", ["$event.target"])
  onResize()
  {
  }
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {

  }
  ngAfterViewInit(): void {
    this.domCtrl.write(()=>{
      let img = new Image();
      img.src = this.src;
      img.onload = () => {
        if(img.width*0.75>img.height){
          // @ts-ignore
          img.style="width:100%;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;"
        }else {
          // @ts-ignore
          img.style="height:100%;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;"
        }
      };
      this.renderer.appendChild(this.element.nativeElement,img);
    });
  }
}
