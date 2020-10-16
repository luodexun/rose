import { AfterViewInit, Component, ElementRef, Input, OnDestroy } from "@angular/core";
import { PlayerService } from "../services/player.service";
import { PlayerEventType } from "../models/player";
import * as Hls from "hls.js";
import { Subscription } from "rxjs";

const videoEvents = ['ready', 'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'encrypted', 'ended', 'interruptbegin', 'interruptend', 'loadeddata', 'loadedmetadata', 'loadstart', 'mozaudioavailable', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
@Component({
  selector: 'rose-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements AfterViewInit,OnDestroy {
  constructor(private el:ElementRef,private playerService:PlayerService ) {

  }
  private eventSub: Subscription;
  public video:HTMLVideoElement;
  private stream:Hls;
  @Input() id:number;
  private eventHandler = (e: Event) => this.handleEvent(e);
  private bindEvent() {
    this.eventSub = this.playerService.video$(this.id).subscribe(e => {
      switch (e.type) {
        case PlayerEventType.RetryPlay:
          if (!this.video) { return; }
          const srcCache = this.video.src;
          const currentTime = this.video.currentTime;
          this.video.src = null;

          setTimeout(() => {
            this.video.src = srcCache;
            this.video.currentTime = currentTime;
            this.video.play();
          });
          break;
        case PlayerEventType.SetCurrentTime:
          this.video.currentTime = this.video.duration * e.detail;
          break;
        default:
          console.log(e)
      }
    });
  }

  public setVideoSrc(src: string) {
    if (!src) { return; }
    this.playerService.push(PlayerEventType.Reset, src,this.id);
    if(Hls.isSupported()){
      if(this.stream){
        this.stream.destroy()
      }
      this.stream = new Hls();
      this.stream.attachMedia(this.video);
      this.stream.loadSource(src);
      this.stream.on(Hls.Events.MANIFEST_PARSED, () =>{
        const event = new CustomEvent('ready', null);
        (this.video as HTMLElement).dispatchEvent(event);
      });
    }else {
      this.video.src = src
    }
    return;
  }
  public init(){
    this.onVideoEvent();
    this.bindEvent();
  }


  public async play(){
   await this.video.play()
  }

  public pause(){
    this.video.pause()
  }


  private onVideoEvent() {
    videoEvents.forEach((eventKey) => {
      if (this.video) { this.video.addEventListener(eventKey, this.eventHandler); }
    });
  }

  private offVideoEvent() {
    videoEvents.forEach((eventKey) => {
      if (this.video) { this.video.removeEventListener(eventKey, this.eventHandler); }
    });
  }



  private handleEvent(e: Event) {
    const eventKey = e.type;
    let detail:number|string|Event|null;
    switch (e.type) {
      case 'timeupdate':
        detail = this.video.currentTime/this.video.duration;
        break;
      case 'progress':
        const lastBufferIndex = this.video.buffered.length - 1;
        const duration = this.video.duration;
        if (lastBufferIndex >= 0) {
          const end =this.video.buffered.end(lastBufferIndex);
          detail = `${end / duration * 100}%`;
        }else {
          detail = null
        }
        break;
      case 'error':
         detail = this.video.error.code;
         break;
      default:
        detail = e
    }
    this.playerService.push(eventKey,detail,this.id);
  }

  ngAfterViewInit(): void {
    this.video = this.el.nativeElement.querySelector('.video');
    this.video.loop = true;
    this.playerService.push(PlayerEventType.videoRender, null,this.id);
  }


  ngOnDestroy(): void {
    if(Hls.isSupported()){
      this.stream.destroy();
    }
    this.eventSub.unsubscribe();
    this.offVideoEvent();
  }

}
