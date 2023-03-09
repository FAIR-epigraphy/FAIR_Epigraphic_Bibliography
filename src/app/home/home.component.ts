import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ZoteroItem } from '../_models/zotero-item.model';
import { AuthService } from '../_service/auth.service';
import { ZoteroSyncService } from '../_service/zotero-sync.service';

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

  title = 'fair-biblio';
  loginUser = null;
  public mainSearchBar: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private syncService: ZoteroSyncService,
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
  }

  getBibloItemInfo() {
    const id = window.location.href.split('/')[window.location.href.split('/').length - 1]
    if (id !== null && id !== '') {
      let data = this.syncService.getPreviousVersion();
      let obj = data.items.filter((x: any) => x.callNumber === id);
      if (obj.length > 0) {
        this.zoteroObject = new ZoteroItem(obj[0]);
        console.log(this.zoteroObject)
        this.biblioItemMore.getSpecificData(this.zoteroObject)
        document.getElementById('btnOpenModalDetail')?.click();
      }
    }
  }

  changeSearchValue(p: any) {
    this.mainSearchBar = p;
  }

  async getAllBiblioData() {
    this.data = await this.syncService.sync();
    if (this.data !== null) {
      if (typeof this.data === 'string') {
        this.showToast(this.data, 'bg-danger');
        this.data = this.syncService.getPreviousVersion()
      }
      this.totalItems = this.data.items.length;
      this.convertJSONToArray(this.data.items);
      this.libraryName = this.data.libraryName;
      this.getLastCallNumber();
      this.loading = false;
    }
  }
  convertJSONToArray(data: any) {
    for (let d of data) {
      let zoteroItem: ZoteroItem = new ZoteroItem(d);
      if (d.itemType !== 'note')
        this.allBiblioData.push(zoteroItem)
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

  ngAfterViewInit() {
    this.getBibloItemInfo();
  }
  closeModal() {
    this.router.navigate([''])
  }

  showToast(msg: any, color: any) {
    document.getElementById('divError')?.classList.add('show')
    document.getElementById('divError')?.classList.add(color)
    this.errorMessage = msg;
    setTimeout(() => {
      document.getElementById('divError')?.classList.remove('show')
      document.getElementById('divError')?.classList.remove(color)
    }, 5000);
  }
}
