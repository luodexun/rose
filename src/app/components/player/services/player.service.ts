import { Injectable } from "@angular/core";
import { PlayerEvent, PlayerEventType } from "../models/player";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { includes } from "lodash";

// import { filter } from "rxjs/operators";
@Injectable()
export class PlayerService {
  public subEvent$:Subject<PlayerEvent> = new Subject();
  constructor() { }
  public  video$(target:number):Observable<PlayerEvent>{
       return this.subEvent$.asObservable().pipe(
         filter((e)=>e.target === target&&includes([PlayerEventType.RetryPlay,PlayerEventType.SetCurrentTime],e.type))
       )
  }
  public control$(target:number):Observable<PlayerEvent>{
       return this.subEvent$.pipe(
         filter((e)=>e.target === target&&includes(['progress','timeupdate','seeking','seeked','ended','reset','ready'],e.type))
       )
  }

  public  player$(target:number):Observable<PlayerEvent>{
       return this.subEvent$.pipe(
         filter((e)=> e.target === target)
       )
  }

  public play(target:number){

    return this.subEvent$.pipe(
      filter((e)=> (e.target === target)&&includes(['playing','reset','ready','error'],e.type))
    )
  }

  public push(type:string|PlayerEventType,details:number|string|Event|null,target:number):void{
    const customEvent = new PlayerEvent(type, details,target);
    this.subEvent$.next(customEvent)
  }
}
