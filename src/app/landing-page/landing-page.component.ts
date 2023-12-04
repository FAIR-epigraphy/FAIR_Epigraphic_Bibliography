import { Component, OnInit, ViewChild } from '@angular/core';
import { ZoteroItem } from '../_models/zotero-item.model';
import { AuthService } from '../_service/auth.service';
import { BiblApiService } from '../_service/bibl-api.service';
import { ZoteroSyncService } from '../_service/zotero-sync.service';
import { AppComponent } from 'src/app/app.component';

declare var bootstrap: any; // Declare Bootstrap as a global variable

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  loginUser = null;
  canActive: boolean = false;
  @ViewChild('biblioItemMore2') biblioItemMore!: any;
  citations: any = [];

  constructor(
    private authService: AuthService,
    private syncService: ZoteroSyncService,
    private apiService: BiblApiService,
    private appComponent: AppComponent
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticate()) {
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
      this.canActive = true;
    }
    else
      this.loginUser = null;

    this.getBibloItemInfo();
  }

  async getBibloItemInfo() {
    const id = window.location.href.split('/')[window.location.href.split('/').length - 1]
    if (id !== null && id !== '') {
      let data = this.syncService.getPreviousVersion();
      let d: any = {};
      if (Object.keys(data).length > 0) {
        d = data.items.find((x: any) => x.callNumber === id);
      }
      else {
        this.showProgress();
        let data: any = await this.syncService.sync(false, this.appComponent);
        this.hideProgress();
        d = data.items.find((x: any) => x.callNumber === id);
      }

      var zoteroObject = new ZoteroItem(d);
      let interval = setInterval(() => {
        if (this.biblioItemMore !== undefined) {
          clearInterval(interval);
          this.biblioItemMore.getSpecificData(zoteroObject)
          document.getElementById('btnOpenModalDetail')?.click();
        }
      }, 100)
    }
  }

  showProgress() {
    let modalEle = document.getElementById('loadingModal')
    const modal = new bootstrap.Modal(modalEle);
    modal.show(); // Show the modal when it's fully initialized.
  }

  hideProgress() {
    document.getElementById('btnHideModal')?.click();
  }

  ngAfterViewInit() {
    //this.getBibloItemInfo();
  }
}
