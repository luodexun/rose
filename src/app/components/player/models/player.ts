export enum PlayerEventType {
  SourceChange = 'sourcechange',
  RetryPlay = 'retryplay',
  videoRender = 'videorender',
  ControlerRender = 'cotrolerrender',
  PlayRender = 'playrender',
  Play ="Play",
  Pause = "Pausex",
  SetCurrentTime = "setcurrentime",
  Reset = "reset",
  Size = "resize",
}

export class PlayerEvent {
  type: PlayerEventType|string;
  detail: any;
  target:number;
  constructor(type: PlayerEventType|string, detail: any,target:number) {
    this.type = type;
    this.detail = detail;
    this.target = target;
  }
}

export class SourceOption {
  src: string;
  quality: string;
  minetype: string;

  constructor(src: string, quality: string, mimeType: string) {
    this.src = src;
    this.quality = quality;
    this.minetype = mimeType;
  }
}
