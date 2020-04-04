import { Injectable } from '@angular/core';
import { RxRequest } from "@utils/rx-request"
@Injectable({
  providedIn: 'root'
})
export class InformationService {
  public http:any;

  constructor() {

    this.http = RxRequest.Instance;
  }

   public index(){
       this.http.get('http://0.0.0.0:4003/api/information',{params:{page:5,limit:5}}).subscribe(
           data => console.log(data)
       )
   }
}
