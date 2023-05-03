import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BiblioItemListComponent } from '../biblio-item-list/biblio-item-list.component';
import { BiblioItemMoreInfoComponent } from '../biblio-item-more-info/biblio-item-more-info.component';
import { Creator } from '../../_models/creator.model';
import { ZoteroItem } from '../../_models/zotero-item.model';


//const { default: api } = require('zotero-api-client');
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  //myapi = api('4Rti1M1IB3Cw2993pop81f5v').library('group', 4858485);
  @Input() libraryName: string = '';
  @ViewChild(BiblioItemListComponent) biblioItemListComp!: BiblioItemListComponent;
  @ViewChild(BiblioItemMoreInfoComponent) biblioItemInfoComp!: BiblioItemMoreInfoComponent;

  ngOnInit() {
  }

  setComponent(listComp: BiblioItemListComponent, infoComp: BiblioItemMoreInfoComponent) {
    this.biblioItemListComp = listComp;
    this.biblioItemInfoComp = infoComp;
    //this.biblioItemListComp.loadAllData(this.biblioItemInfoComp);
    this.biblioItemInfoComp.zoteroObject = null;
  }

  getAllDataFromZotero(event: Event) {
    let target = event.currentTarget || event.target;
    (target as HTMLElement).classList.add('active');
    //this.biblioItemListComp.loadAllData(this.biblioItemInfoComp);
    //this.biblioItemInfoComp.zoteroObject = null;
  }
}
