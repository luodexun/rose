import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2 } from "@angular/core";
import { getTouchTarget } from "@components/player/utils/control";
import { TabService } from "@services/api/tab.service";
import { Results } from "@models/api/video";
import { VideoEventType } from "@models/player/event";
import { PlayerStatusService } from "@services/status/player.status.service";
import { delay } from "lodash";
import { Router } from "@angular/router";

@Component({
  selector: 'rose-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements OnDestroy,AfterViewInit {
  private container:HTMLElement;
  private div1:any;
  private div2:any;
  private div3:any;
  private mouseDownOrigin = 0;
  private height:number;
  private isMouseDown = false;
  private status = 1;
  private pool:Results[];
  private pointer:number;
  private progressBartouchstartHandler = (e) => this.cursorDown(e);
  private progressBarMousemoveHandler = (e: TouchEvent | MouseEvent) => this.cursorMove(e);
  private progressBarMouseupHandler = (e: TouchEvent | MouseEvent) => this.cursorUp(e);
  constructor(private el:ElementRef,private render:Renderer2,private tabService:TabService,private service:PlayerStatusService, private router: Router,) {
    this.tabService.video().subscribe(async (data:Results[])=>{
      this.pool = data;
      this.pointer = 3;
      this.service.push(VideoEventType.Init, 1,this.pool[this.pointer]);
      this.service.push(VideoEventType.Init, 2,this.pool[this.pointer+1]);
      this.service.push(VideoEventType.Init, 3,this.pool[this.pointer+2]);
      this.service.push(VideoEventType.Play, 2,null);
    });
  }

  private OnEvent(){
    this.container.addEventListener('touchstart', this.progressBartouchstartHandler,false);
    this.container.addEventListener('touchmove', this.progressBarMousemoveHandler, false);
    this.container.addEventListener('touchend', this.progressBarMouseupHandler, false);
  }

  private offEvent(){
    this.container.removeEventListener('touchstart', this.progressBartouchstartHandler);
    this.container.removeEventListener('touchmove', this.progressBarMousemoveHandler);
    this.container.removeEventListener('touchend', this.progressBarMouseupHandler);
  }

 async ngAfterViewInit() {
   this.container = this.el.nativeElement;
    while (!this.height){
      this.height =await this.getFrame();
    }
    while (!this.div3){
      let {div1,div2,div3} = await this.getDiv();
      this.div1 = div1;
      this.div2 = div2;
      this.div3 = div3;
    }
    this.OnEvent();
  }

  private async getFrame():Promise<number>{
    return new Promise(resolve =>{
      setTimeout(()=>{
        resolve(this.el.nativeElement.parentNode.clientHeight)
      },800)
    } )
  }

  private async getDiv():Promise<any>{
    return new Promise(resolve => {
      setTimeout(()=>{
        return resolve({div1:this.container.querySelector(".div1"),div2:this.container.querySelector(".div2"),div3:this.container.querySelector(".div3")})
      },500);
    })
  }


  private cursorDown(e: TouchEvent | MouseEvent) {
    e.stopPropagation();
    this.removeBezier();
    const target = getTouchTarget(e as TouchEvent);
    this.mouseDownOrigin = (e instanceof MouseEvent) ? (e as MouseEvent).y : (target ? target.pageY : 0);
    this.isMouseDown = true;
  }

  private cursorMove(e: TouchEvent | MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const target = getTouchTarget(e as TouchEvent);
    if (this.isMouseDown) {
      const mouseY = (e instanceof MouseEvent) ? (e as MouseEvent).y : (target ? target.pageY : 0);
      this.setSwiper(mouseY-this.mouseDownOrigin);
    }
  }

  private cursorUp(e: TouchEvent | MouseEvent) {
    e.stopPropagation();
    const target = getTouchTarget(e as TouchEvent);
    if (this.isMouseDown) {
      const mouseY = (e instanceof MouseEvent) ? (e as MouseEvent).y : (target ? target.pageY : 0);
      this.setSlide(mouseY-this.mouseDownOrigin);
      this.isMouseDown = false;
    }
  }

  private setSwiper(y){
    if(y>0){
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div1,'transform',`translateY(${y - this.height}px)`);
          this.render.setStyle(this.div2,'transform',`translateY(${y - this.height}px)`);
          break;
        case 2:
          this.render.setStyle(this.div2,'transform',`translateY(${y - 2*this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${y - 2*this.height}px)`);
          break;
        case 3:
          this.render.setStyle(this.div1,'transform',`translateY(${y}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${y - 3*this.height}px)`);
          break;
      }
    }else{
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div2,'transform',`translateY(${y - this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${y - this.height}px)`);
          break;
        case 2:
          this.render.setStyle(this.div1,'transform',`translateY(${y + this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${y - 2*this.height}px)`);
          break;
        case 3:
          this.render.setStyle(this.div1,'transform',`translateY(${y}px)`);
          this.render.setStyle(this.div2,'transform',`translateY(${y}px)`);
          break;
      }
    }

  }

  private  setSlide(y:number){
     if(y<0){
        this.addBezier(true);
        this.prve(y<-this.height*0.1);
     }else{
       this.addBezier(false);
        this.next(y>this.height*0.1);
     }
  }

  private async prve(s: boolean) {
    if (s) {
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div1,'transform',`translateY(${this.height}px)`);
          this.render.setStyle(this.div2,'transform',`translateY(${-2*this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-2*this.height}px)`);
          break;
        case 2:
          this.render.setStyle(this.div1,'transform',`translateY(0)`);
          this.render.setStyle(this.div2,'transform',`translateY(0)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-3*this.height}px)`);
          break;
        case 3:
          this.render.setStyle(this.div1,'transform',`translateY(${-this.height}px)`);
          this.render.setStyle(this.div2,'transform',`translateY(${-this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-this.height}px)`);
          break;
      }
      this.status===3?this.status=1:this.status++;
      let index = this.pointer+3>8?this.pointer-6:this.pointer+3;
      this.pointer===8?this.pointer=0:this.pointer++;
      switch (this.status) {
        case 1:
         await delay(()=>{
            this.service.push(VideoEventType.Pause, 1,null);
            this.service.push(VideoEventType.Play, 2,null);
          },800);
          await delay(()=>{
            this.service.push(VideoEventType.Init, 3,this.pool[index]);
          },2000);
          break;
        case 2:
          await  delay(()=>{
            this.service.push(VideoEventType.Pause, 2,null);
            this.service.push(VideoEventType.Play, 3,null);
          },800);
          await   delay(()=>{
            this.service.push(VideoEventType.Init, 1,this.pool[index]);
          },2000);
          break;
        case 3:
          await  delay(()=>{
            this.service.push(VideoEventType.Pause, 3,null);
            this.service.push(VideoEventType.Play, 1,null);
          },800);
          await  delay(()=>{
            this.service.push(VideoEventType.Init, 2,this.pool[index]);
          },2000);
          break;
      }
    } else {
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div2,'transform',`translateY(${-this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-this.height}px)`);
          break;
        case 2:
          this.render.setStyle(this.div1,'transform',`translateY(${this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-2*this.height}px)`);
          break;
        case 3:
          this.render.setStyle(this.div1,'transform',`translateY(0)`);
          this.render.setStyle(this.div2,'transform',`translateY(0)`);
          break;
      }
    }
  }

  private async next(s:boolean){
    if (s) {
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div1,'transform',`translateY(0)`);
          this.render.setStyle(this.div2,'transform',`translateY(0)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-3*this.height}px)`);
          break;
        case 2:
          this.render.setStyle(this.div1,'transform',`translateY(${-this.height}px)`);
          this.render.setStyle(this.div2,'transform',`translateY(${-this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-this.height}px)`);
          break;
        case 3:
          this.render.setStyle(this.div1,'transform',`translateY(${this.height}px)`);
          this.render.setStyle(this.div2,'transform',`translateY(${-2*this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-2*this.height}px)`);
          break;
      }
      this.status===1?this.status=3:this.status--;
      this.pointer===0?this.pointer=8:this.pointer--;
      switch (this.status) {
        case 1:
          await delay(()=>{
            this.service.push(VideoEventType.Pause, 3,null);
            this.service.push(VideoEventType.Play, 2,null);
          },800);
          await  delay(()=>{
            this.service.push(VideoEventType.Init, 1,this.pool[this.pointer]);
          },2000);
          break;
        case 2:
          await  delay(()=>{
            this.service.push(VideoEventType.Pause, 1,null);
            this.service.push(VideoEventType.Play, 3,null);
          },800);
          await  delay(()=>{
            this.service.push(VideoEventType.Init, 2,this.pool[this.pointer]);
          },2000);
          break;
        case 3:
          await delay(()=>{
            this.service.push(VideoEventType.Pause, 2,null);
            this.service.push(VideoEventType.Play, 1,null);
          },800);
          await delay(()=>{
            this.service.push(VideoEventType.Init, 3,this.pool[this.pointer]);
          },2000);
          break;
      }
    } else {
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div1,'transform',`translateY(${-this.height}px)`);
          this.render.setStyle(this.div2,'transform',`translateY(${-this.height}px)`);
          break;
        case 2:
          this.render.setStyle(this.div2,'transform',`translateY(${-2*this.height}px)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-2*this.height}px)`);
          break;
        case 3:
          this.render.setStyle(this.div1,'transform',`translateY(0)`);
          this.render.setStyle(this.div3,'transform',`translateY(${-3*this.height}px)`);
          break;
      }
    }
  }

  private addBezier(s:boolean){
    if(s){
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div2,'transition','all .5s ease');
          this.render.setStyle(this.div3,'transition','all .5s ease');
          break;
        case 2:
          this.render.setStyle(this.div1,'transition','all .5s ease');
          this.render.setStyle(this.div3,'transition','all .5s ease');
          break;
        case 3:
          this.render.setStyle(this.div1,'transition','all .5s ease');
          this.render.setStyle(this.div2,'transition','all .5s ease');
          break;
      }
    }else {
      switch (this.status) {
        case 1:
          this.render.setStyle(this.div1,'transition','all .5s ease');
          this.render.setStyle(this.div2,'transition','all .5s ease');
          break;
        case 2:
          this.render.setStyle(this.div2,'transition','all .5s ease');
          this.render.setStyle(this.div3,'transition','all .5s ease');
          break;
        case 3:
          this.render.setStyle(this.div1,'transition','all .5s ease');
          this.render.setStyle(this.div3,'transition','all .5s ease');
          break;
      }
    }

  }

  private removeBezier(){
    this.render.setStyle(this.div1,'transition','none');
    this.render.setStyle(this.div2,'transition','none');
    this.render.setStyle(this.div3,'transition','none');
  }


  private home(){
     this.router.navigate(['/tabs/tab1'])
  }

  ngOnDestroy(): void {
    this.offEvent();
  }
}
