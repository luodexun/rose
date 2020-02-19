import { Component } from '@angular/core';
import { StorageService } from '@services/storage/storage.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private storage: StorageService) {
        this.storage.set('kk', 'ldx574425450');
  }

}
