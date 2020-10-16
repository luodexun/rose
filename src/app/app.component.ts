import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { PinCodeModal } from "@app/modals/pin-code/pin-code";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
    ModalController,
    NavController,
    Platform,
} from "@ionic/angular";
import { Setting } from '@models/setting/setting';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from "@services/auth/auth.service";
import { SettingService } from '@services/setting/setting.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit{
  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private navController: NavController,
    private statusBar: StatusBar,
    private translate: TranslateService,
    public settingService: SettingService,
    public authService: AuthService,
    public element: ElementRef,
    private renderer: Renderer2
  ) {
    this.initializeApp();
    this.initTranslate();
    this.initTheme();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.settingService.settings.subscribe(
          async (settings:Setting) =>{
              if(settings.usePassword){
                  const modal = await this.modalCtrl.create({
                      component: PinCodeModal,
                      componentProps: {
                          isClose: false,
                          message: "PIN_CODE.DEFAULT_MESSAGE",
                          validatePassword: true,
                      },
                  });

                  await modal.present();
                  modal.onDidDismiss().then(({ data: status }) => {
                      if (status) {
                          this.authService.hasSeenIntro().subscribe(hasSeenIntro => {
                              if (!hasSeenIntro) {
                                  this.openPage("/intro", true);
                                  return;
                              }
                              this.openPage("", true);
                          });
                      }
                  });
              }else {
                  this.authService.hasSeenIntro().subscribe(hasSeenIntro => {
                      if (!hasSeenIntro) {
                          this.openPage("/intro", true);
                          return;
                      }
                      this.openPage("", true);
                  });
              }
          }
      );


    });
  }


    initTranslate() {
        this.translate.setDefaultLang('zh');
        this.settingService.settings.subscribe(settings => {
            this.translate.use(settings.language);
        });
    }

    initTheme() {
        this.settingService.settings.subscribe(settings => {
            if (settings.darkMode) {
                this.renderer.addClass(this.element.nativeElement.parentNode, 'dark-theme');
            } else {
                this.renderer.removeClass(this.element.nativeElement.parentNode, 'dark-theme');
            }
        });
    }
    ngOnInit() {
        this.settingService.onUpdate$.subscribe(() => {
            this.initTranslate();
            this.initTheme();
        });
    }

    openPage(path: string, rootPage: boolean = true) {
        if (rootPage) {
            this.navController.navigateRoot(path);
        } else {
            this.navController.navigateForward(path);
        }
    }

    ngOnDestroy() {

    }
}
