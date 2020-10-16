import { AfterViewInit,OnDestroy, Component, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import { PlayerService } from "@components/player/services/player.service";
import { Subscription } from "@root/node_modules/rxjs";
import { PlayerEventType } from "@components/player/models/player";
import * as Hls from "hls.js";
@Component({
  selector: 'rose-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements AfterViewInit,OnDestroy {
  private el: HTMLElement;
  private eventSub: Subscription;
  private status = PlayerEventType.Pause;
  @Input() id:number;
  private playHander = (e) => {
    if(this.status === PlayerEventType.Pause){
      this.hide();
      this.playerService.push(PlayerEventType.Play, e,this.id);
    }else {
      this.show();
      this.playerService.push(PlayerEventType.Pause, e,this.id);
    }

  };
  constructor(private container:ElementRef,private playerService:PlayerService,private render:Renderer2) { }


  private bindEvent() {
    this.eventSub = this.playerService.play(this.id).subscribe(e => {
      if (e.type === 'playing') {
        this.hide();
      } else if (e.type === 'reset') {
        this.hide();
      } else if (e.type === 'error') {
        this.show();
      }
    });
  }

  private onEvent(){
    this.container.nativeElement.addEventListener('click', this.playHander);
  }

  public init(){
    this.bindEvent();
    this.onEvent();
  }

  private offEvent(){
    this.container.nativeElement.removeEventListener('click',this.playHander)
  }

  private hide() {
    this.status = PlayerEventType.Play;
    this.render.setStyle(this.el,'display','none');
  }

  private show() {
    this.status = PlayerEventType.Pause;
    this.render.setStyle(this.el,'display','block');
  }

  ngAfterViewInit(): void {
    this.el = this.container.nativeElement.querySelector('.bigPlay');
    this.playerService.push(PlayerEventType.PlayRender, null,this.id);
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
    this.offEvent();
  }

}
