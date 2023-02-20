import { Component, Input, ViewChild } from '@angular/core';
import { Creator } from '../../_models/creator.model';
import { ZoteroItem } from '../../_models/zotero-item.model';
//const { default: api } = require('zotero-api-client');

@Component({
  selector: 'app-biblio-item-list',
  templateUrl: './biblio-item-list.component.html',
  styleUrls: ['./biblio-item-list.component.scss']
})
export class BiblioItemListComponent {

  //myapi = api('4Rti1M1IB3Cw2993pop81f5v').library('group', 4858485);
  @Input() biblioData: Array<ZoteroItem> = new Array();
  //creator: Creator = new Creator(null);
  start = 0;
  limit = 30;
  @Input() loading = false;
  loadingEnd = false;
  totalRecord = 0;
  @Input() biblioItemInfoComp: any;
  @Input() canActive: boolean = false;
  
  public currentSelectedRecord: any = null;

  getSpecificData(obj: ZoteroItem) {
    console.log(obj)
    this.currentSelectedRecord = obj;
    this.biblioItemInfoComp.getSpecificData(obj);
  }

  // loadAllData(infoComp: BiblioItemMoreInfoComponent)
  // {
  //   this.biblioItemInfoComp = infoComp;
  // }

  onScroll(event: Event) {
  }

  getCreators(value: any) {
    let creators: Array<Creator> = new Array();
    for (let c of value) {
      creators.push(new Creator(c));
    }
    return creators;
  }
}
