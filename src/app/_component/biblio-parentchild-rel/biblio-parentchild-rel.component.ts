import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { BiblApiService } from 'src/app/_service/bibl-api.service';
import { ZoteroItem } from '../../_models/zotero-item.model';
const { default: api } = require('zotero-api-client');

@Component({
  selector: 'app-biblio-parentchild-rel',
  templateUrl: './biblio-parentchild-rel.component.html',
  styleUrls: ['./biblio-parentchild-rel.component.scss']
})
export class BiblioParentchildRelComponent implements OnInit {

  myapi = api('4Rti1M1IB3Cw2993pop81f5v').library('group', 4858485);
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

  categories: any = [];
  errorMessage = '';
  @Input() lastestCallNumber = '';
  added_by = 0;
  isSaving = false;
  // parentFromDB = false;

  constructor(
    private apiService: BiblApiService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    if (this.biblioData.length > 0) {
      this.biblioDataParent = this.biblioData.map(a => Object.assign(new ZoteroItem(a), a));
      this.biblioDataChild = this.biblioData.map(a => Object.assign(new ZoteroItem(a), a));

      //this.biblioDataParent[0].abstractNote = 'dfgdfgd'
      this.getAllCategories();
      //this.getLatestCallNumber();
      console.log(this.lastestCallNumber);
      this.added_by = JSON.parse(this.authService.getToken() || '{}').id;

    }
  }

  getAllCategories() {
    this.apiService.getAllCategories().subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          this.categories = resp;
          //this.categories.unshift({ id: 0, cat_name: 'Select category' });
        }
        else {
          this.categories = [];
        }
      }
      else {
        this.categories = [];
      }
    })
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
    this.apiService.getBiblioParentChildItemsByCallNo(this.currentSelectedRecord.callNumber).subscribe(async (resp) => {
      if (resp !== null)
        if (resp.length > 0) {
          for (let child of resp) {
            let index = this.biblioDataChild.findIndex(x => x.callNumber === child.child_callNumber)
            if (index === -1) continue;

            let obj: any = this.biblioDataChild[index];
            if (child.cat_id != null)
              obj['sel_cat'] = child.cat_id;

            this.selectedChildBiblio.push(obj);
            this.biblioDataChild.splice(index, 1);
          }
        }
        else {
          this.currentSelectedRecord.callNumber = await this.updateCallNumber(this.currentSelectedRecord);
          this.btnParentRemove = true;
        }

      this.selectedParentBiblio = this.currentSelectedRecord;
      let index = this.biblioDataChild.findIndex(x => x.key === this.selectedParentBiblio.key)
      this.biblioDataChild.splice(index, 1);
      this.btnParentAdd = false;

    });
  }

  removeFromParentList() {
    this.biblioDataChild.push(this.selectedParentBiblio)
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

  async addToChildList() {
    for (let i = 0; i < this.currentSelectedRecordChild.length; i++) {
      this.selectedChildBiblio.push(this.currentSelectedRecordChild[i])
      let index = this.biblioDataChild.findIndex(x => x.key === this.currentSelectedRecordChild[i].key)
      if (index >= 0)
        this.biblioDataChild.splice(index, 1)
    }
    await this.addParentChildRel();
    this.currentSelectedRecordChild = []
    this.btnChildAdd = false;
    //this.btnChildRemove = true;
  }

  selectChildFromList(selBib: ZoteroItem, event: Event) {
    Array.from((event.target as HTMLElement).parentElement?.children as HTMLCollection).forEach((e, i) => {
      if (e.nodeName.toLocaleLowerCase() === 'button') {
        e.classList.remove('active')
      }
    });
    (event.target as HTMLElement).classList.add('active')
    this.selectedChildBiblioObj = selBib
    this.btnChildRemove = true;
  }

  removeFromChildList() {
    if (this.selectedChildBiblioObj !== null) {
      this.apiService.deleteChildItem(this.selectedParentBiblio.callNumber, this.selectedChildBiblioObj.callNumber)
        .subscribe(resp => {
          if (resp !== null) {
            if (resp.indexOf('Error') > -1) {
              this.showToast(resp, 'bg-danger');
            }
            else {
              this.biblioDataChild.push(this.selectedChildBiblioObj)
              let index = this.selectedChildBiblio.findIndex(x => x.key === this.selectedChildBiblioObj.key)
              this.selectedChildBiblio.splice(index, 1);
              this.selectedChildBiblioObj = null;
              this.btnChildRemove = false;
            }
          }
        });
    }
  }
  ///////////////////////////////////////////////////////////
  async updateCallNumber(obj: any) {
    if (obj.callNumber === '') {
      let replaced = parseInt(this.lastestCallNumber.replace(/\D/g, ''));
      replaced++;
      this.lastestCallNumber = 'epig' + replaced;
      obj.callNumber = this.lastestCallNumber;
      let resp = await this.myapi.items(obj.key).patch(
        {
          callNumber: obj.callNumber,
          version: obj.version
        });
      return obj.callNumber;
    }
    return obj.callNumber;
  }

  async addParentChildRel() {
    // this.isSaving = true;
    // if (this.selectedChildBiblio.filter(x => x.sel_cat === undefined).length > 0) {
    //   this.showToast('Please select category for all children', 'bg-danger');
    //   return;
    // }

    //set child call number if it is not assigned
    for (let sel of this.selectedChildBiblio) {
      sel.callNumber = await this.updateCallNumber(sel);
    }

    this.apiService.addBiblioParentChildItem(this.selectedParentBiblio, this.selectedChildBiblio, this.added_by)
      .subscribe(respList => {
        console.log(respList);
        //this.isSaving = false;
        //this.showToast('Record updated', 'bg-success');
      })
  }

  async updateChildCategory() {
    if (this.selectedChildBiblio.filter((x: any) => x.sel_cat !== undefined).length > 0) {
      this.isSaving = true
      this.apiService.UpdateChildCategory(this.selectedParentBiblio, this.selectedChildBiblio)
        .subscribe(respList => {
          console.log(respList);
          this.isSaving = false;
          this.showToast('Record updated', 'bg-success');
        })
    }
    else {
      this.showToast('Record updated', 'bg-success');
    }
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
