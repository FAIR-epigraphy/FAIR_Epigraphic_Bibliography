import { Component, Input, OnInit } from '@angular/core';
import { Creator } from '../../_models/creator.model';
import { ZoteroItem } from '../../_models/zotero-item.model';

@Component({
  selector: 'app-biblio-parentchild-rel',
  templateUrl: './biblio-parentchild-rel.component.html',
  styleUrls: ['./biblio-parentchild-rel.component.scss']
})
export class BiblioParentchildRelComponent implements OnInit {

  @Input() biblioData: Array<ZoteroItem> = new Array();
  biblioDataParent: Array<ZoteroItem> = new Array();
  biblioDataChild: Array<ZoteroItem> = new Array();
  public currentSelectedRecord: any = null;
  public currentSelectedRecordChild: Array<any> = [];
  searchTextParent: string = '';
  searchTextChild: string = '';

  btnParentAdd: boolean = false;
  btnParentRemove: boolean = false;

  btnChildAdd: boolean = false;
  btnChildRemove: boolean = false;

  selectedParentBiblio: any = null;
  selectedChildBiblio: Array<any> = [];
  selectedChildBiblioObj: any = null

  ngOnInit(): void {
    if (this.biblioData.length > 0) {
      this.biblioDataParent = this.biblioData.map(a => Object.assign(new ZoteroItem(a), a));
      this.biblioDataChild = this.biblioData.map(a => Object.assign(new ZoteroItem(a), a));

      //this.biblioDataParent[0].abstractNote = 'dfgdfgd'
    }
  }
  /////////////////////////////////////////////////////
  //////////// Parent Section Logic
  getSpecificData(obj: ZoteroItem) {
    //console.log(obj)
    this.currentSelectedRecord = obj;
    if (this.selectedParentBiblio === null)
      this.btnParentAdd = true;
  }

  addToParentList() {
    this.selectedParentBiblio = this.currentSelectedRecord;
    this.btnParentAdd = false;
    this.btnParentRemove = true;
  }

  removeFromParentList() {
    this.selectedParentBiblio = null;
    this.btnParentRemove = false;
    this.currentSelectedRecord = null;
  }
  /////////////////////////////////////////////////////
  //////////// Child Section Logic
  getSpecificDataChild(obj: ZoteroItem) {
    //console.log(obj)
    if (this.currentSelectedRecordChild.length > 0) {
      let index = this.currentSelectedRecordChild.findIndex(x => x.key === obj.key);
      if (index < 0)
        this.currentSelectedRecordChild.push(obj);
      else
        this.currentSelectedRecordChild.splice(index, 1);
    }
    else {
      this.currentSelectedRecordChild.push(obj);
    }

    this.btnChildAdd = true;
  }

  getHiglightedChild(obj: ZoteroItem) {
    return this.currentSelectedRecordChild.filter(x => x.key === obj.key).length > 0 ? true : false;
  }

  addToChildList() {
    for (let i = 0; i < this.currentSelectedRecordChild.length; i++) {
      this.selectedChildBiblio.push(this.currentSelectedRecordChild[i])
      let index = this.biblioDataChild.findIndex(x => x.key === this.currentSelectedRecordChild[i].key)
      if (index >= 0)
        this.biblioDataChild.splice(index, 1)
    }
    this.currentSelectedRecordChild = []
    this.btnChildAdd = false;
    //this.btnChildRemove = true;
  }

  selectChildFromList(selBib: ZoteroItem, event: Event) {
    Array.from((event.target as HTMLElement).parentElement?.children as HTMLCollection).forEach((e, i)=>{
      if(e.nodeName.toLocaleLowerCase() === 'button')
      {
        e.classList.remove('active')
      }
  });
    (event.target as HTMLElement).classList.add('active')
    this.selectedChildBiblioObj = selBib
    this.btnChildRemove = true;
  }

  removeFromChildList() {
    if(this.selectedChildBiblioObj !== null)
    {
      this.biblioDataChild.push(this.selectedChildBiblioObj)
      let index = this.selectedChildBiblio.findIndex(x=>x.key === this.selectedChildBiblioObj.key)
      this.selectedChildBiblio.splice(index, 1);
      this.selectedChildBiblioObj = null;
      this.btnChildRemove = false;
    }
  }
}
