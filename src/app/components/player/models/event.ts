export enum TabEventType {
  Display,
  TabActive
}
export class TabEvent {
  type: TabEventType;
  detail: any;
  constructor(type: TabEventType, detail: any) {
    this.type = type;
    this.detail = detail;
  }
}
