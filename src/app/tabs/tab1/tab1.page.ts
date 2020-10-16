import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IonInfiniteScroll } from '@ionic/angular';
import { StorageService } from '@services/storage/storage.service';
import {TabService} from "@services/api/tab.service";
import { Results } from "@models/api/goods";
import * as _ from "lodash";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnDestroy,OnInit{
  @ViewChild('IonInfiniteScroll',{static:true}) infiniteScroll: IonInfiniteScroll;
  public list:Results[] = [];
  constructor  (
    private storage: StorageService,
    private tabService:TabService
  ) {
    tabService.frame().subscribe((data:Results[])=>{
      this.list=this.list.concat(data);
    });
  }

  ngOnInit(): void {
    // this.tabService.frame$.subscribe(data =>{
    //   if(_.isEmpty(data)){
    //     this.infiniteScroll.disabled = true;
    //   }else {
    //     this.list=this.list.concat(data);
    //   }
    //
    // });
  }

  more(event) {
    this.tabService.moreFrame().subscribe(data =>{
        if(_.isEmpty(data)){
          event.target.disabled = true;
        }else {
          this.list=this.list.concat(data);
        }
       setTimeout(() => {
        event.target.complete();
        }, 500);
      });

  }

  doRefresh(event) {
    this.tabService.frame().subscribe((data:Results[])=>{
      this.infiniteScroll.disabled =false;
      setTimeout(() => {
        event.target.complete();
        this.list=data;
      }, 2000);
    });
  }

  ngOnDestroy(): void {

  }

}
