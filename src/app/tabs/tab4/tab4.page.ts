import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { PinCodeComponent } from "@components/pin-code/pin-code";
import {
    AlertController,
    ModalController,
    NavController,
    Platform,
} from '@ionic/angular';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "@services/auth/auth.service";
import { SettingService } from '@services/setting/setting.service';
import * as _ from "lodash";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit, OnDestroy {
    @ViewChild("pinCode", { read: PinCodeComponent, static: true })
    pinCode: PinCodeComponent;
  public objectKeys = Object.keys;
  public currentSettings;
  public availableOptions;
  public onEnterPinCode:()=>void;
  public appVersion = 132;
  public haPassword:boolean;
  private unsubscriber$: Subject<void> = new Subject<void>();
  constructor(
      public platform: Platform,
      private navCtrl: NavController,
      private alertCtrl: AlertController,
      private modalCtrl: ModalController,
      private settingsDataProvider: SettingService,
      private translateService: TranslateService,
      private authService: AuthService,
  ) {
      this.availableOptions = this.settingsDataProvider.AVALIABLE_OPTIONS;

  }

    public onUpdate() {
        this.settingsDataProvider.save(this.currentSettings);
    }

    public onUsePassword(){
      this.authService.getMasterPassword().subscribe((password)=>{
          if(!password||_.isNil(password)){
              const success = ()=>{
                  this.onUpdate();
                  this.haPassword = true;
              };
              this.onEnterPinCode = success;
              this.pinCode.createPinCode();
          }else{
              this.onUpdate();
          }
      })
    }

    public async openChangePinPage() {
        this.pinCode.updatePinCode()
    }

    public confirmClearData() {
        this.translateService
            .get([
                "CANCEL",
                "CONFIRM",
                "ARE_YOU_SURE",
                "SETTINGS_PAGE.CLEAR_DATA_TEXT",
            ])
            .subscribe(async translation => {
                const confirm = await this.alertCtrl.create({
                    header: translation.ARE_YOU_SURE,
                    message: translation["SETTINGS_PAGE.CLEAR_DATA_TEXT"],
                    buttons: [
                        {
                            text: translation.CANCEL,
                        },
                        {
                            text: translation.CONFIRM,
                            handler: () => {
                                this.onEnterPinCode = this.clearData;
                                this.pinCode.open(
                                    "PIN_CODE.DEFAULT_MESSAGE",
                                    false,
                                );
                            },
                        },
                    ],
                });

                confirm.present();
            });
    }
    private clearData() {
        this.settingsDataProvider.clearData();
        this.navCtrl.navigateRoot("/intro");
    }
     ngOnInit() {
       this.authService.getMasterPassword().subscribe((password)=>{
           if(!password||_.isNil(password)){
               this.haPassword = false
           }else{
               this.haPassword = true
           }
       });
        this.settingsDataProvider.settings
            .pipe(
                takeUntil(this.unsubscriber$),
                tap(settings => (this.currentSettings = settings)),
            )
            .subscribe();
        this.settingsDataProvider.onUpdate$
            .pipe(
                takeUntil(this.unsubscriber$),
                tap(settings => (this.currentSettings = settings)),
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }
}
