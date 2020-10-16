import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class HiddenService {
  private  event$:BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { }

  public display(){
    return this.event$.asObservable()
  }
  public push(status:boolean){
    this.event$.next(status);
  }
}
