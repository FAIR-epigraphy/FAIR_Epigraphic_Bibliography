import { Component, Input, OnInit } from '@angular/core';
import { Creator } from '../../_models/creator.model';
import { ZoteroItem } from '../../_models/zotero-item.model';
import { BiblApiService } from '../../_service/bibl-api.service'
import { AuthService } from '../../_service/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ZoteroSyncService } from 'src/app/_service/zotero-sync.service';

@Component({
  selector: 'app-biblio-item-more-info',
  templateUrl: './biblio-item-more-info.component.html',
  styleUrls: ['./biblio-item-more-info.component.scss']
})
export class BiblioItemMoreInfoComponent {

  zoteroObject: any = null;
  user: any = null;
  hasPermission = false;
  isOpenTextbox = false;
  formLink: FormGroup;
  @Input() totalNumberOfRecords = 0;
  @Input() lastCallNumber = '';
  resourceTypes: any = [];
  isDisplayedResourceType = false;


  constructor(
    private apiService: BiblApiService,
    private authService: AuthService,
    private zoteroAPI: ZoteroSyncService
  ) {
    this.formLink = new FormGroup({
      link: new FormControl('', [
        Validators.required,
        Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ]),
    });
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  async getSpecificData(obj: ZoteroItem) {
    this.user = JSON.parse(this.authService.getToken() || '{}');
    if (this.user.role_name === 'Admin' || this.user.role_name === 'Editor') this.hasPermission = true;

    this.zoteroObject = obj;
    await this.updateCallNumber();

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
      //this.updateCallNumber();

      this.getVIAF();
      this.geResourceTypes();
      this.getItemByCallNo();
      this.getRelations(this.zoteroObject);
      //console.log(resp)
    })
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

  async updateCallNumber() {
    if (this.zoteroObject.callNumber === '') {
      let replaced = parseInt(this.lastCallNumber.replace(/\D/g, ''));
      replaced++;
      this.lastCallNumber = 'epig' + replaced;
      this.zoteroObject.callNumber = this.lastCallNumber;
      console.log(this.lastCallNumber);
      await this.zoteroAPI.updateCallNumber(this.zoteroObject);
    }
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

  showTextbox(obj: any) {
    if ('relations' in obj) {
      obj.relations.added = false;
    }
    // else if ('firstName' in obj) {
    //   let c = this.zoteroObject.creators.filter((x: any) => x.firstName === obj.firstName && x.lastName === obj.lastName && x.creatorType === obj.creatorType);
    //   c[0].VIAF = '';
    // }
    else if ('value' in obj) {
      obj.value.push({ abbr: '', source: '' })
    }
  }

  addRelations(obj: any) {
    if (this.formLink.valid) {
      this.apiService.addBiblioItemLink(obj.callNumber, this.formLink.value.link).subscribe(resp => {
        delete obj.relations.added;
        this.resetForm(this.formLink);
        this.getRelations(this.zoteroObject);
      })
    }
    //return false;
  }

  addVIAF(obj: Creator, event: any) {
    let c = this.zoteroObject.creators.filter((x: any) => x.firstName === obj.firstName && x.lastName === obj.lastName && x.creatorType === obj.creatorType);
    let objCreator: any = null;
    objCreator = c[0];
    if (event.target.value !== '') {
      if (/^[1-9]{1,22}$/.test(event.target.value)) {
        objCreator.VIAF.value = event.target.value;
        //objCreator.ORCID = formData.ORCID;
        this.apiService.addCreatorVIAF(objCreator, this.zoteroObject.callNumber).subscribe(resp => {
          if (resp !== null) {
            c[0].VIAF.value = event.target.value;
          }
        })
        objCreator.VIAF.invalid = false;
      }
      else {
        objCreator.VIAF.invalid = true;
      }
    }
    else {
      objCreator.VIAF.invalid = true;
    }
  }

  addORCID(obj: Creator, event: any) {
    let c = this.zoteroObject.creators.filter((x: any) => x.firstName === obj.firstName && x.lastName === obj.lastName && x.creatorType === obj.creatorType);
    let objCreator: any = null;
    objCreator = c[0];
    if (event.target.value !== '') {
      if (/^(\d{4}-){3}\d{3}(\d|X)$/.test(event.target.value)) {
        objCreator.ORCID.value = event.target.value;
        objCreator.ORCID.invalid = false;

        this.apiService.addCreatorORCID(objCreator, this.zoteroObject.callNumber).subscribe(resp => {
          if (resp !== null) {
            c[0].ORCID.value = event.target.value;
          }
        })
      }
      else {
        objCreator.ORCID.invalid = true;
      }
    }
    else {
      objCreator.ORCID.invalid = true;
    }
  }

  visableResourceTypeDropDown() {
    this.isDisplayedResourceType = !this.isDisplayedResourceType;
  }

  updateItemResourceType() {
    //console.log(this.zoteroObject.resourceType)
    this.apiService.UpdateItemResourceTypeByCallNumber(this.zoteroObject.callNumber, this.zoteroObject.resourceTypeId)
      .subscribe(resp => {
        this.apiService.getItemByCallNumber(this.zoteroObject.callNumber).subscribe(resp => {
          if (resp !== null) {
            if (resp.length > 0) {
              this.zoteroObject.resourceType = resp[0].resourceTypeGeneral;
              this.zoteroObject.resourceTypeId = resp[0].resourceTypeId;
            }
          }
        });
      });
  }

  getAbbr(item: any) {
    //let abbr = (item.value as Array<string>).slice(1);
    return item.value;
  }

  addAbbreviation(item: any, event: any) {
    let target = event.currentTarget || event.target;
    let abbr = target.children[0].children[0].value;
    let source = target.children[0].children[1].value;
    if (abbr !== '' && source !== '') {
      let obj: any = {};
      obj.abbr = abbr;
      obj.source = source;
      obj.callNumber = this.zoteroObject.callNumber;
      item.value[item.value.length - 1].invalid = false;

      this.apiService.addItemAbbr(obj).subscribe(resp => {
        item.value[item.value.length - 1].abbr = abbr;
        item.value[item.value.length - 1].source = source;
      })

    }
    else {
      item.value[item.value.length - 1].invalid = true;
    }
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
