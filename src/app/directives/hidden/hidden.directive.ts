import { Directive,ElementRef,HostBinding,OnInit,OnDestroy,AfterViewInit} from '@angular/core';
import { Subscription } from "rxjs";
import { PlayerStatusService } from "@services/status/player.status.service";
@Directive({
  selector: '[appHidden]'
})
export class HiddenDirective implements OnInit,OnDestroy,AfterViewInit{
  private eventSub: Subscription;
  @HostBinding('style.display') display:string;
  constructor(private el:ElementRef,private service:PlayerStatusService) {

  }

  ngOnInit(): void {
    this.eventSub = this.service.tab().subscribe((tab:string)=>{
      if(tab==="tab3"){
        this.display='none'
      }else {
        this.display ='flex';
      }
    });
  }
  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }

  ngAfterViewInit(): void {

  }

}
