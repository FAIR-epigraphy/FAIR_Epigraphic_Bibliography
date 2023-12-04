import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ZoteroItem } from '../_models/zotero-item.model';
import { AuthService } from '../_service/auth.service';
import { BiblApiService } from '../_service/bibl-api.service';
import { ZoteroSyncService } from '../_service/zotero-sync.service';
import { AppComponent } from 'src/app/app.component';

declare var bootstrap: any; // Declare Bootstrap as a global variable

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('biblioItemMore2') biblioItemMore!: any;
  allBiblioData: Array<ZoteroItem> = new Array();
  data: any = [];
  start = 0;
  totalRecord = 0;
  libraryName = ''
  loading = false;
  zoteroObject: any = null;
  parentComp: any = null;
  callNumber: string = '';
  canActive: boolean = false;
  lastCallNumber = '';
  @Input() searchText: string = '';
  errorMessage = '';
  totalItems = 0;
  citations: any = [];
  allAltTitles: any = [];

  title = 'fair-biblio';
  loginUser = null;
  public mainSearchBar: string = '';

  constructor(
    private router: Router,
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

    this.allBiblioData = []
    this.loading = true;
    this.getAllBiblioData()
    this.getAllBiblioCitationsStyle();

  }

  changeSearchValue(p: any) {
    this.mainSearchBar = p;
  }

  async getAllBiblioData() {
    this.showProgress();
    this.data = await this.syncService.sync(false, this.appComponent);
    this.hideProgress();
    if (this.data !== null) {
      if (typeof this.data === 'string') {
        this.showToast(this.data, 'bg-danger');
        this.data = this.syncService.getPreviousVersion()
      }
      this.apiService.getAllAlternateTitle().subscribe(resp => {
        this.allAltTitles = resp;
        this.totalItems = this.data.items.length;
        this.convertJSONToArray(this.data.items);
        this.libraryName = this.data.libraryName;
        this.getLastCallNumber();
        //this.getAllAbbr()
        this.loading = false;
      });
    }
  }

  async getAllBiblioCitationsStyle() {
    this.citations = await this.syncService.getAllBiblioCitationStyles();
  }

  // async getAllAbbr() {
  //   for (let zObject of this.allBiblioData) {
  //     if (zObject.shortTitle[0]['abbr'] !== '') {
  //       let resp = await firstValueFrom(this.apiService.getItemAbbr(zObject.callNumber, zObject.shortTitle[0]['abbr']));
  //       if (resp !== null) {
  //         if (resp.length > 0) {
  //           for (let d of resp.filter((x: any) => x.seg1_abbr !== undefined)) {
  //             if (d.seg1_abbr !== null) {
  //               if (zObject.shortTitle.filter((x: any) => x.abbr === d.seg1_abbr && x.source === 'SEG 1').length === 0)
  //                 zObject.shortTitle.push({ abbr: d.seg1_abbr, source: 'SEG 1' })
  //             }
  //             if (d.seg2_abbr !== null) {
  //               if (zObject.shortTitle.filter((x: any) => x.abbr === d.seg2_abbr && x.source === 'SEG 2').length === 0)
  //                 zObject.shortTitle.push({ abbr: d.seg2_abbr, source: 'SEG 2' })
  //             }
  //           }
  //           if (resp[0].aiegl_id !== null) {
  //             /// Update the AIEGL Source
  //             zObject.shortTitle[0].source = 'AIEGL'
  //           }
  //           //console.log(`${zObject.key} - ${resp[0].aiegl_id}`)
  //         }
  //         else {
  //           if (zObject.shortTitle[0]['abbr'] !== '')
  //             console.log(`${zObject.key} - ${resp} - ${zObject.shortTitle[0]['abbr']} Not Found`)
  //         }
  //       }
  //     }
  //   }
  //   let downloadData = this.allBiblioData.map(({ key, callNumber, shortTitle }) => ({ key: key, callNumber: callNumber, shortTitle: shortTitle }));
  //   let str = '';
  //   //this.syncService.download('allDataWithAbbr.json', JSON.stringify(downloadData));
  // }

  convertJSONToArray(data: any) {
    for (let d of data) {
      let zoteroItem: ZoteroItem = new ZoteroItem(d);
      if (d.itemType !== 'note') {
        if (this.allAltTitles.filter((x: any) => x.callNumber === zoteroItem.callNumber).length > 0) {
          zoteroItem.altTitle = this.allAltTitles.filter((x: any) => x.callNumber === zoteroItem.callNumber).map((x: any) => x.title);
        }
        this.allBiblioData.push(zoteroItem);
      }
    }
  }

  getLastCallNumber() {
    let filtered = this.allBiblioData.filter(x => x.callNumber !== '');
    let maxCallNumber = filtered.sort(function (a, b) {
      try {
        const nameA = a.callNumber.toUpperCase(); // ignore upper and lowercase
        const nameB = b.callNumber.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
      } catch (error) {
        console.log(a, b)
      }
      // call number must be equal
      return 0;
    });
    this.lastCallNumber = maxCallNumber[0].callNumber;
  }

  closeModal() {
    this.router.navigate([''])
  }

  showProgress() {
    let modalEle = document.getElementById('loadingModal')
    const modal = new bootstrap.Modal(modalEle);
    modal.show(); // Show the modal when it's fully initialized.
  }

  hideProgress() {
    document.getElementById('btnHideModal')?.click();
  }

  showToast(msg: any, color: any) {
    document.getElementById('divErrorHome')?.classList.add('show')
    document.getElementById('divErrorHome')?.classList.add(color)
    this.errorMessage = msg;
    setTimeout(() => {
      document.getElementById('divErrorHome')?.classList.remove('show')
      document.getElementById('divErrorHome')?.classList.remove(color)
    }, 5000);
  }
}
