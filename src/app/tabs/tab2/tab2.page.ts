import { Component, ViewChild, ElementRef,Renderer2,AfterViewInit,OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { StorageService } from '@services/storage/storage.service';
import { ToastService } from '@services/toast/toast.service';
import { TabService } from "@services/api/tab.service";
import { PlayerStatusService } from "@services/status/player.status.service";
import {Subscription} from "rxjs"
import FlvJs from "flv.js";
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements AfterViewInit,OnDestroy{
  private data:any[];
  private api = false;
  private renderEl = false;
  private eventSub:Subscription;
  constructor(
    private router: Router,
    private storage: StorageService,
    private toast: ToastService,
    private el:ElementRef,
    private render:Renderer2,
    private tabService:TabService,
    private service:PlayerStatusService
    ) {
    this.eventSub = this.tabService.streams().subscribe((data:any)=>{
       this.data = data;
       this.api = true;
       this.play();
    })

  }
  async ngAfterViewInit(){
    this.renderEl = true;
    this.play();
  }

  private play(){
    let video = this.el.nativeElement.querySelector("#video");
    if(this.api&&this.renderEl&&this.data.length !== 0){
      if(FlvJs.isSupported()){
        let flvPlayer = FlvJs.createPlayer({
          type: 'flv',
          url: `http://192.168.1.100:8000/${this.data[0].app}/${this.data[0].stream}.flv`
        });
        flvPlayer.attachMediaElement(video);
        flvPlayer.load();
        flvPlayer.play();
      }else {
        video.src = `http://192.168.1.100:8000/${this.data[0].app}/${this.data[0].stream}/index.m3u8`;
        video.play();
      }
    }
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }

}
