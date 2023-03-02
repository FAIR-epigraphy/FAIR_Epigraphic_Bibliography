import { Component, OnInit, ViewChild, Input, Host } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ZoteroItem } from '../_models/zotero-item.model';
const { default: api } = require('zotero-api-client');
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('biblioItemMore2') biblioItemMore!: any;
  myapi = api('4Rti1M1IB3Cw2993pop81f5v').library('group', 4858485);
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
  @Input() searchText: string = '';

  constructor(
    //private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticate())
      this.canActive = true;

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

  getAllBiblioData() {
    if (localStorage.getItem(`allBiblioData`) !== undefined && localStorage.getItem(`allBiblioData`) !== null) {
      let item = JSON.parse(localStorage.getItem(`allBiblioData`) || '{}');
      this.convertJSONToArray(item);
      this.libraryName = localStorage.getItem(`biblioLibrary`) as string;
      this.loading = false;
      //this.getBibloItemInfo();
    }
    else {
      (async () => {
        await this.getItem()
        this.convertJSONToArray(this.data);
        localStorage.setItem(`allBiblioData`, JSON.stringify(this.data))
        localStorage.setItem(`biblioLibrary`, this.libraryName)
        this.loading = false;
        //this.getBibloItemInfo()
      })();
    }
  }

  async getItem() {
    let itemsResponse = await this.myapi.items().get({ limit: 100, start: this.start });
    if (itemsResponse.getData().length === 0) return;
    this.data.push(...itemsResponse.getData())
    this.start += 100
    if (this.totalRecord === 0)
      this.totalRecord = itemsResponse.getTotalResults();
    if (this.libraryName === '')
      this.libraryName = itemsResponse.raw[0].library.name;

    await this.getItem()
  }

  convertJSONToArray(data: any) {
    for (let d of data) {
      let zoteroItem: ZoteroItem = new ZoteroItem(d);
      if (d.itemType !== 'note')
        this.allBiblioData.push(zoteroItem)
    }
  }
  ngAfterViewInit() {
    this.getBibloItemInfo();
  }
  closeModal() {
    this.router.navigate([''])
  }
}
