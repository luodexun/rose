import { Directive,OnInit,HostListener,HostBinding } from '@angular/core';
import { HiddenService } from "@services/status/hidden.service";

@Directive({
  selector: '[appDouble]'
})
export class DoubleDirective {
  private status = false;
  @HostBinding('style.display') display:string;
  @HostListener("click") click(){
    this.status =!this.status;
    this.service.push(this.status)
  }
  constructor(private service:HiddenService) {
    this.service.display().subscribe((status:boolean)=>{
      this.status = status;
    })
  }


}
