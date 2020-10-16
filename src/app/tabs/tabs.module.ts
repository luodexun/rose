import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { DirectivesModule } from "@directives/directives.module"
import { TabsPage } from './tabs.page';
@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        TranslateModule,
        DirectivesModule
    ],
    declarations: [TabsPage],
    exports: [TranslateModule]
})
export class TabsPageModule {}
