import { Injectable } from "@angular/core";
import { BehaviorSubject,ReplaySubject } from "rxjs";
import { PlayerEvent, PlayerEventType, VideoEvent, VideoEventType } from "@models/player/event";
import { filter, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PlayerStatusService {

  private  tabEvent$:BehaviorSubject<string> = new BehaviorSubject('tab1');
  private  videoEvent$:ReplaySubject<VideoEvent> = new ReplaySubject(3);

  public tab(){
    return this.tabEvent$.asObservable()
  }

  public video(id:number){
    return this.videoEvent$.pipe(
      filter(e=>e.target === id)
    )
  }

  public send(tab:string){
    this.tabEvent$.next(tab)
  }

  public push(type:VideoEventType,target:number,details){
    this.videoEvent$.next(new VideoEvent(type,target,details))
  }

  public all(){
    return this.videoEvent$.asObservable()
  }
}
