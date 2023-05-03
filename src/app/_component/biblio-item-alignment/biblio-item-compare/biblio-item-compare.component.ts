import { Component, Input, OnInit } from '@angular/core';
import { Creator } from '../../../_models/creator.model';
import { ZoteroItem } from '../../../_models/zotero-item.model';
import { BiblApiService } from '../../../_service/bibl-api.service'
import { AuthService } from '../../../_service/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ZoteroSyncService } from 'src/app/_service/zotero-sync.service';

@Component({
  selector: 'app-biblio-item-compare',
  templateUrl: './biblio-item-compare.component.html',
  styleUrls: ['./biblio-item-compare.component.scss']
})
export class BiblioItemCompareComponent {
  zoteroObject: any = null;
  user: any = null;
  hasPermission = false;
  isOpenTextbox = false;
  resourceTypes: any = [];
  isDisplayedResourceType = false;
  tabs: any = '';

  constructor(
    private apiService: BiblApiService,
    private authService: AuthService,
    private zoteroAPI: ZoteroSyncService
  ) {
  }

  async getSpecificData(obj: ZoteroItem, origin:any) {
    document.getElementById('info-tab')?.click();
    this.zoteroObject = obj;
    this.apiService.getItemAbbr(this.zoteroObject.callNumber, this.zoteroObject.shortTitle[0]['abbr']).subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          for (let d of resp.filter((x: any) => x.seg1_abbr !== undefined)) {
            if (d.seg1_abbr !== null) {
              if (this.zoteroObject.shortTitle.filter((x: any) => x.abbr === d.seg1_abbr && x.source === 'SEG 1').length === 0)
                this.zoteroObject.shortTitle.push({ abbr: d.seg1_abbr, source: 'SEG 1' })
            }
            if (d.seg2_abbr !== null) {
              if (this.zoteroObject.shortTitle.filter((x: any) => x.abbr === d.seg2_abbr && x.source === 'SEG 2').length === 0)
                this.zoteroObject.shortTitle.push({ abbr: d.seg2_abbr, source: 'SEG 2' })
            }
          }

          // Custom Abbr
          for (let d of resp.filter((x: any) => x.abbr !== undefined)) {
            if (this.zoteroObject.shortTitle.filter((x: any) => x.abbr === d.abbr && x.source === d.source).length === 0)
              this.zoteroObject.shortTitle.push({ abbr: d.abbr, source: d.source })
          }
        }
      }
      this.zoteroObject = obj;

      this.getVIAF();
      this.geResourceTypes();
      this.getItemByCallNo();
      this.getRelations(this.zoteroObject);
    })

    this.tabs = origin === 'biblio' ? 'biblio' : 'zotero';
  }

  getItemByCallNo() {
    this.apiService.getItemByCallNumber(this.zoteroObject.callNumber).subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          this.zoteroObject.resourceType = resp[0].resourceTypeGeneral;
          this.zoteroObject.resourceTypeId = resp[0].resourceTypeId;
        }
      }
    });
  }

  geResourceTypes() {
    this.apiService.getAllItemResourceTypes().subscribe(resp => {
      if (resp.length > 0) {
        this.resourceTypes = resp;
      }
    });
  }

  getVIAF() {
    this.apiService.getVIAF_ORCIDByCreator(this.zoteroObject.creators).subscribe(respList => {
      for (let resp of respList) {
        if (resp.length > 0) {
          let index = this.zoteroObject.creators.findIndex((x: Creator) => x.firstName === resp[0].first_name &&
            x.lastName === resp[0].last_name
          );
          if (index > -1)
            this.zoteroObject.creators[index].VIAF.value = resp[0].VIAF;
          this.zoteroObject.creators[index].ORCID.value = resp[0].ORCID;
        }
      }
    });
  }

  itemHasValue(obj: any) {
    let retVal = false;
    if (obj !== null)
      if (typeof obj === 'string') {
        if (obj !== '')
          retVal = true;
      }
      else if (typeof obj === 'object') {
        if (obj !== null)
          if (Array.from(obj).length > 0)
            retVal = true;
      }

    return retVal;
  }

  getColumnName(key: any) {
    let colName = key.replace(/([a-z])([A-Z])/g, '$1 $2');
    // if(colName.split(' ').length < 1)
    // {
    //   return colName.toUpperCase();
    // }
    return colName;
  }

  getNotes(obj: ZoteroItem) {
    return ZoteroItem.notes.filter((x: any) => x.parentItem === obj.key).map((x: any) => x.note);
  }

  getRelations(obj: ZoteroItem) {
    //return Object.entries(obj.relations).filter(([key]) => !key.includes('added'))
    this.apiService.getAllBiblioItemLinks(obj.callNumber).subscribe(resp => {
      let rels = this.zoteroObject.url.split(',')
      if (resp.length > 0) {
        for (let r of resp) {
          if (rels.findIndex((x: any) => x === r.link) === -1) {
            this.zoteroObject.url += ',' + r.link;
          }
        }
      }
    });
  }

  getRelationURIs() {
    let rel = this.zoteroObject.url.split(',');
    if (rel[0] === '')
      return [];
    return rel;
  }

  visableResourceTypeDropDown() {
    this.isDisplayedResourceType = !this.isDisplayedResourceType;
  }

  getAbbr(item: any) {
    //let abbr = (item.value as Array<string>).slice(1);
    return item.value;
  }

  getFirstAbbr(item: any) {
    return item[0] as string;
  }

  getCreators(value: any) {
    let creators: Array<Creator> = new Array();
    for (let c of value) {
      creators.push(new Creator(c));
    }
    return creators;
  }

  trackByIdFn(item: any): number {
    return item.firstName;
  }
}
