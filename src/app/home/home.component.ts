import { Component, OnInit, ViewChild, Input, Host } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ZoteroItem } from '../_models/zotero-item.model';
const { default: api } = require('zotero-api-client');
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
    if (this.authService.isAuthenticate())
    {
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
      let obj = this.allBiblioData.filter(x => x.callNumber === id);
      if (obj.length > 0) {
        this.zoteroObject = obj[0] as ZoteroItem;
        console.log(this.zoteroObject)
        this.biblioItemMore.getSpecificData(this.zoteroObject)
        document.getElementById('btnOpenModal')?.click();
      }
    }
  }

  async getAllBiblioData() {
    this.data = await this.syncService.sync();
    if (this.data !== null) {
      if(typeof this.data === 'string')
      {
        this.showToast(this.data, 'bg-danger');
        this.data = this.syncService.getPreviousVersion()
      }
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

  getLastCallNumber()
  {
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

  takeBackup(){
    this.syncService.takeBackup();
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
