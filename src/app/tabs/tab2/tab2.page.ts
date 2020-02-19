import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@services/storage/storage.service';
import { ToastService } from '@services/toast/toast.service';
import { from } from 'rxjs';
import * as constants from '@app/app.constants';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
   public kk: string;
  constructor(
    private router: Router,
    private storage: StorageService,
    private toast: ToastService
    ) {
    this.storage.get('kk').subscribe(kk => this.kk = kk);
  }
   buttonClick() {
        this.router.navigate(['tabs/tab1/home']).then((data) => {console.log(data); });
    }

    toastClick() {
      this.toast.error('我的世界是没有烦恼的', 3600000, constants.TOAST_POSITION);
    }

    public change(): void {
         this.storage.set('kk', '我的世界').subscribe(x => console.log(x));
         console.log(this.kk);
    }
}
