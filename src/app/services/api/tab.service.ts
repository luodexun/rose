import { Injectable } from '@angular/core';
import { RxRequest } from "@utils/rx-request";
import {  Observable} from "rxjs";
import { Results } from "@models/api/goods";
import Pagination from "@models/api/pagination";
import {map} from "rxjs/operators";
import { localhost } from '../../utils/os'
@Injectable({
  providedIn: 'root'
})
export class TabService {
  public http:RxRequest;
  private framePage:Pagination;
  private page = 1;
  private videoPage:Pagination;
  private pageVideo = 1;
  constructor() {
    this.http = RxRequest.Instance;
  }
  public frame():Observable<Results[]>{
    return new Observable((observer)=>{
      this.http.get(`http://${localhost()}:1102/goods`,{params:{page:1,limit:5}}).subscribe((res)=>{
        if(res.code === 1000){
          this.framePage = res.data.metadata;
          observer.next(res.data.results);
          observer.complete();
        }

      })
    })

  }
  public moreFrame():Observable<Results[]>{
    this.page++;
    if(this.page>Math.ceil(this.framePage.total/this.framePage.num)){
      return new Observable((observer)=>{
        observer.next([]);
        observer.complete();
      });
    }else {
      return new Observable((observer)=>{
        this.http.get(`http://${localhost()}:1102/goods`,{params:{
            page:this.page,
            limit:this.framePage.num
          }}).subscribe((res) =>  {
          if(res.code === 1000){
            this.framePage = res.data.metadata;
            observer.next(res.data.results);
            observer.complete();
          }
        })
      });
    }
  }
  public video(){
    return new Observable((observer)=>{
      this.http.get(`http://${localhost()}:1102/videos`,{params:{page:1,limit:9}}).subscribe((res)=>{
        if(res.code === 1000){
          this.videoPage = res.data.metadata;
          observer.next(res.data.results);
          observer.complete();
        }
      })
    }).pipe(
      map((data:[])=>{
       return data.map((item:any)=>{
          item.url =`http://${localhost()}:1102${item.url}`;
          item.cover =`http://${localhost()}:1102${item.cover}`;
          return  item
        })
      })
    )
  }


  public moreVideo(){
    this.pageVideo++;
    if(this.pageVideo>Math.ceil(this.videoPage.total/this.videoPage.num)){
      return new Observable((observer)=>{
        observer.next([]);
        observer.complete();
      });
    }else {
      return new Observable((observer)=>{
        this.http.get(`http://${localhost()}:1102/videos`,{params:{
            page:this.pageVideo,
            limit:this.videoPage.num
          }}).subscribe((res) =>  {
          if(res.code === 1000){
            this.videoPage = res.data.metadata;
            observer.next(res.data.results);
            observer.complete();
          }
        })
      }).pipe(
        map((data:[])=>{
          return data.map((item:any)=>{
            item.url =`http://${localhost()}:1102${item.url}`;
            item.cover =`http://${localhost()}:1102${item.cover}`;
            return  item
          })
        })
      )
    }
  }


  public streams(){
    return new Observable((observer)=>{
      this.http.get(`http://${localhost()}:1102/streams`).subscribe((res)=>{
        observer.next(res);
      })
    })
  }
}
