import { AfterViewInit, Component, ElementRef, Input,Output,EventEmitter, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { VideoComponent } from "./video/video.component";
import { PlayerService } from "@components/player/services/player.service";
import { PlayerEventType } from "@components/player/models/player";
import { Subscription } from "@root/node_modules/rxjs";
import { ControlsComponent } from "./controls/controls.component";
import { PlayerStatusService } from "@services/status/player.status.service";
import { VideoEvent, VideoEventType } from "@models/player/event";
import { PlayComponent } from "./play/play.component";
@Component({
  selector: 'rose-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements AfterViewInit,OnDestroy,OnInit {
   private eventSub: Subscription;
   private tabEvent:Subscription;
   private videoEvent:Subscription;
   private tab:string;
   private status:VideoEventType = VideoEventType.Node;
   private full = true;
   private videoRender = false;
   private controlRender = false;
   private playerRender = false;
   private playRender = false;
   @Input() id:number;
   @Output() backe:EventEmitter<void> = new EventEmitter<void>();
   @ViewChild('player',{read:VideoComponent,static:true}) video:VideoComponent;
   @ViewChild('control',{read:ControlsComponent,static:true}) control:ControlsComponent;
   @ViewChild('play',{read:PlayComponent,static:true}) play:PlayComponent;
  constructor(
    private playerService:PlayerService
    ,private service:PlayerStatusService
    ,private el:ElementRef
    ,private render:Renderer2
  ) {}

  ngOnInit(): void {
    this.bindEvent();
  }

  public bindEvent(){
    this.eventSub = this.playerService.player$(this.id).subscribe(
      (e)=>{
        switch (e.type) {
          case PlayerEventType.videoRender:
            this.videoRender = true;
            this.bindOptionEvent();
            break;
          case PlayerEventType.ControlerRender:
            this.controlRender = true;
            this.bindOptionEvent();
            break;
          case PlayerEventType.PlayRender:
            this.playRender = true;
            this.bindOptionEvent();
            break;
          case PlayerEventType.Play:
            this.video.play();
            break;
          case PlayerEventType.Pause:
            this.video.pause();
            break;
          case "ended":
            this.control.reset();
            break;
          default:
            // console.log(e)
        }
      }
    )
  }

  private bindOptionEvent(){
    if(this.videoRender&&this.controlRender&&this.playerRender&&this.playRender){
      this.control.init();
      this.video.init();
      this.play.init();
      this.tabEvent = this.service.tab().subscribe(async (tab)=>{
        this.tab = tab;
        if(tab === "tab3"){
          if(this.status === VideoEventType.Play){
           await this.video.play();
          }
        }else {
          if(this.status === VideoEventType.Play){
            this.video.pause();
          }
        }
      });
      this.videoEvent = this.service.video(this.id).subscribe(async (data:VideoEvent)=>{
        switch (data.type) {
          case VideoEventType.Init:
            this.render.setStyle(this.el.nativeElement.querySelector('.mask'),'background',`url(${data.details.cover}) center/auto 100% no-repeat`);
            this.video.setVideoSrc(data.details.url);
            break;
          case VideoEventType.Play:
            if (this.tab === "tab3") {
             await this.video.play();
            }
            break;
          case VideoEventType.Pause:
            this.video.pause();
            this.control.reset();
            break;
        }
        this.status = data.type;
      })
    }
  }

  ngAfterViewInit(): void {
    this.playerRender = true;
    this.bindOptionEvent();
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
    this.tabEvent.unsubscribe();
    this.videoEvent.unsubscribe();
  }

  private up(){
     this.backe.emit();
  }
}
