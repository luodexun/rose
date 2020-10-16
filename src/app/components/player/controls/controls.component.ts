import { AfterViewInit, Component, ElementRef, Input, OnDestroy, Renderer2 } from "@angular/core";
import { PlayerService } from "@components/player/services/player.service";
import { PlayerEventType } from "@components/player/models/player";
import { getTouchTarget, HAS_MOUSE_EVENT, IS_ANDROID, IS_IOS, parsePercent } from "../utils/control";
import { Subscription } from "rxjs";

@Component({
  selector: 'rose-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements AfterViewInit,OnDestroy {
  private el: HTMLElement;
  private backgroundEl: HTMLElement;
  private bufferedEl: HTMLElement;
  private fillEl: HTMLElement;
  private cursorEl: HTMLElement;
  private mouseDownOrigin = 0;
  private cursorOrigin = 0;
  private isMouseDown = false;
  private seeking = false;
  private seekingTimer: any;
  @Input() id:number;
  private eventSub: Subscription;
  private progressBartouchstartHandler = (e) => {
    this.backgroundDown(e);
    this.cursorDown(e);
  };
  private progressBarMousemoveHandler = (e: TouchEvent | MouseEvent) => this.cursorMove(e);
  private progressBarMouseupHandler = (e: TouchEvent | MouseEvent) => this.cursorUp(e);
  constructor(private container:ElementRef,private playerService:PlayerService,private render:Renderer2) {

  }
  private bindEvent() {
    this.eventSub = this.playerService.control$(this.id).subscribe(e => {
      switch (e.type) {
        case 'progress':
          this.resetBuffered(e.detail);
          break;
        case 'timeupdate':
          if (!this.seeking) {
            this.resetCursor(e.detail);
          }
          break;
        case 'seeking':
          this.seeking = true;
          break;
        case 'seeked':
          clearTimeout(this.seekingTimer);
          if (IS_IOS) {
            this.seekingTimer = setTimeout(() => this.seeking = false, 2000); // prevent ios seeking delay
          } else {
            this.seeking = false;
          }
          break;
        case 'ended':
          this.resetCursor(0);
          break;
        case 'reset':
          this.resetProgressBar();
          break;
        case 'ready':
          this.show();
      }
    });
  }

  private onEvent(){
    if (HAS_MOUSE_EVENT && !IS_IOS && !IS_ANDROID) {
      this.el.addEventListener('mousedown', (e) => {
        if (e.target === this.backgroundEl) {
          this.backgroundDown(e);
        } else if (e.target === this.cursorEl) {
          this.cursorDown(e);
        }
      });
    } else {
      this.el.addEventListener('touchstart', this.progressBartouchstartHandler);
      this.el.addEventListener('touchmove', this.progressBarMousemoveHandler, false);
      this.el.addEventListener('touchend', this.progressBarMouseupHandler, false);
    }
  }

  private  offEvent(){
    this.el.removeEventListener('touchstart',this.progressBartouchstartHandler);
    this.el.removeEventListener('touchmove',this.progressBarMousemoveHandler);
    this.el.removeEventListener('touchend',this.progressBartouchstartHandler);
  }

  public init(){
    this.bindEvent();
    this.onEvent();
  }


  private show() {
    this.render.setStyle(this.el,'visibility','')
  }

  private hide() {
    this.render.setStyle(this.el,'visibility','hidden');
  }

  private resetProgressBar() {
    this.resetCursor(0);
    this.render.setStyle(this.bufferedEl,'width',`0%`);
  }

  private resetBuffered(percent) {
    if (!percent) { return; }
    this.render.setStyle(this.bufferedEl,'width',percent);
  }

  private backgroundDown(e: TouchEvent | MouseEvent) {
    let offsetX: number;
    if (e instanceof MouseEvent) {
      offsetX = (e as MouseEvent).offsetX;
    } else {
      const elRect = this.el.getBoundingClientRect();
      offsetX = (e as TouchEvent).targetTouches[0].pageX - elRect.left;
    }

    const percent = offsetX / this.el.getBoundingClientRect().width;

    this.resetCursor(percent);
    this.resetCurrentTime(percent);
  }

  private cursorDown(e: TouchEvent | MouseEvent) {

    const target = getTouchTarget(e as TouchEvent);
    this.mouseDownOrigin = (e instanceof MouseEvent) ? (e as MouseEvent).x : (target ? target.pageX : 0);
    this.cursorOrigin = this.cursorEl.offsetLeft;
    this.isMouseDown = true;
  }

  private cursorMove(e: TouchEvent | MouseEvent) {
    const target = getTouchTarget(e as TouchEvent);
    if (this.isMouseDown) {
      const mouseX = (e instanceof MouseEvent) ? (e as MouseEvent).x : (target ? target.pageX : 0);
      const percent = this.caclulateOffsetX(mouseX);
      this.resetCursor(percent);
      this.seeking = true;
    }
  }

  private cursorUp(e: TouchEvent | MouseEvent) {
    const target = getTouchTarget(e as TouchEvent);
    if (this.isMouseDown) {
      const mouseX = (e instanceof MouseEvent) ? (e as MouseEvent).x : (target ? target.pageX : 0);
      const percent = this.caclulateOffsetX(mouseX);
      this.resetCurrentTime(percent);
      this.isMouseDown = false;
      this.seeking = false;
    }
  }

  private caclulateOffsetX(eventX: number): number {
    const progressBarWidth = this.el.getBoundingClientRect().width;
    let offsetX = eventX - this.mouseDownOrigin;
    offsetX += this.cursorOrigin;
    if (offsetX < 0) { offsetX = 0; }
    if (offsetX > progressBarWidth) { offsetX = progressBarWidth; }
    return offsetX / progressBarWidth;
  }

  public reset(){
    this.resetCursor(0);
    this.resetCurrentTime(0)
  }

  private resetCursor(percent: number) {
    percent = parsePercent(percent);
    this.render.setStyle(this.fillEl,'width',`${percent * 100}%`);
    this.render.setStyle(this.cursorEl,'left',`${percent * 100}%`);
  }

  private resetCurrentTime(percent: number) {
    percent = parsePercent(percent);
    this.playerService.push(PlayerEventType.SetCurrentTime,percent,this.id);
  }

  ngAfterViewInit(): void {
    this.el = this.container.nativeElement.querySelector('.progressBar');
    this.backgroundEl = this.container.nativeElement.querySelector('.progressBarBackground');
    this.bufferedEl = this.container.nativeElement.querySelector('.progressBarBuffered');
    this.fillEl = this.container.nativeElement.querySelector('.progressBarFill');
    this.cursorEl = this.container.nativeElement.querySelector('.progressBarCursor');
    this.playerService.push(PlayerEventType.ControlerRender, null,this.id);
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
    this.offEvent();
  }

}
