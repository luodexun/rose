import { Component } from "@angular/core";
import { PlayerEventType } from "@models/player/event";
import { PlayerStatusService } from "@services/status/player.status.service";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage{
    constructor(private service:PlayerStatusService) {

    }
    private tabchange($event){
      this.service.send($event.tab)
   }

}
