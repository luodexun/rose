import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@services/storage/storage.service';

import { Observable, of, Subject} from 'rxjs';

import { Setting } from '@models/setting/setting';
import * as _ from 'lodash';

import * as constants from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
    public onUpdate$: Subject<Setting> = new Subject();

    private _settings: Setting;

    public AVALIABLE_OPTIONS = {
        languages: {
            en: 'English',
            de: 'Deutsch',
            fr: 'French',
            id: 'Indonesia',
            it: 'Italiano',
            nl: 'Nederlands',
            sv: 'Svenska',
            ru: 'Русский',
            gr: 'Ελληνικά',
            pt: 'Português',
            cs: 'Čeština',
            kor: '한국어',
            bg: 'Български',
            pl: 'Polish',
            zh: '中文'
        }
    };
  constructor(
      private storage: StorageService,
      private translate: TranslateService
  ) {
      this.load().subscribe((data) => {
          this._settings = data;
          this.save();
      });

  }

    public get settings() {
        if (_.isNil(this._settings)) {
            return this.load();
        } else {
            return of(this._settings);
        }
    }

    public getDefaults(): Setting {
        const cultureLang = this.translate.getBrowserCultureLang();
        const browserLang = this.translate.getBrowserLang();
        const appLang = this.AVALIABLE_OPTIONS.languages[cultureLang]
            ? cultureLang
            : this.AVALIABLE_OPTIONS.languages[browserLang]
                ? browserLang
                : "en";

        return Setting.defaults(appLang);
    }

    public save(options?: Setting): Observable<any> {
        const settings = options || this._settings;

        for (const prop in options) {
            this._settings[prop] = settings[prop];
        }

        if (options) { this.onUpdate$.next(this._settings); }
        return this.storage.set(constants.STORAGE_SETTINGS, this._settings);
    }

    public clearData(): void {
        this.storage.clear();
        this._settings = this.getDefaults();
        this.onUpdate$.next(this._settings);
    }

    private load(): Observable<Setting> {
        return new Observable((observer) => {
            this.storage.getObject(constants.STORAGE_SETTINGS).subscribe((response) => {
                let data = response;

                if (_.isEmpty(data)) {
                    data = this.getDefaults();
                }

                observer.next(data);
            });
        });
    }
}
