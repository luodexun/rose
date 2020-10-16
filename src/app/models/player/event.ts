export enum PlayerEventType {
  Display,
  TabActive
}

export class PlayerEvent {
  type: PlayerEventType;
  detail: any;
  constructor(type: PlayerEventType, detail: any) {
    this.type = type;
    this.detail = detail;
  }
}

export enum VideoEventType{
  Pause,
  Play,
  Init,
  Node
}

export class VideoEvent {
  type: VideoEventType;
  target: number;
  details:any;
  constructor(type: VideoEventType, target: number|null,details:any = null) {
    this.type = type;
    this.target = target;
    this.details = details
  }
}
