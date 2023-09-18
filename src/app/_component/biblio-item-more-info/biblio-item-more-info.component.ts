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
  @Input() citations: any = [];
  resourceTypes: any = [];
  isDisplayedResourceType = false;
  errorMessage: any = '';
  alternateTitles: any = [];
  parentComponent: any = null;

  citationLanguage: any = JSON.parse('[{"language":"Afrikaans","langKey":"af-ZA"},{"language":"Arabic","langKey":"ar"},{"language":"Basque","langKey":"eu"},{"language":"Bulgarian","langKey":"bg-BG"},{"language":"Catalan","langKey":"ca-AD"},{"language":"Chinese (PRC)","langKey":"zh-CN"},{"language":"Chinese (Taiwan)","langKey":"zh-TW"},{"language":"Croatian","langKey":"hr-HR"},{"language":"Czech","langKey":"cs-CZ"},{"language":"Danish","langKey":"da-DK"},{"language":"Dutch","langKey":"nl-NL"},{"language":"English (UK)","langKey":"en-GB"},{"language":"English (US)","langKey":"en-US"},{"language":"Estonian","langKey":"et-EE"},{"language":"Finnish","langKey":"fi-FI"},{"language":"French (Canada)","langKey":"fr-CA"},{"language":"French (France)","langKey":"fr-FR"},{"language":"German (Austria)","langKey":"de-AT"},{"language":"German (Germany)","langKey":"de-DE"},{"language":"German (Switzerland)","langKey":"de-CH"},{"language":"Greek","langKey":"el-GR"},{"language":"Hebrew","langKey":"he-IL"},{"language":"Hindi","langKey":"hi-IN"},{"language":"Hungarian","langKey":"hu-HU"},{"language":"Icelandic","langKey":"is-IS"},{"language":"Indonesian","langKey":"id-ID"},{"language":"Italian","langKey":"it-IT"},{"language":"Japanese","langKey":"ja-JP"},{"language":"Khmer","langKey":"km-KH"},{"language":"Korean","langKey":"ko-KR"},{"language":"Latin","langKey":"la"},{"language":"Latvian","langKey":"lv-LV"},{"language":"Lithuanian","langKey":"lt-LT"},{"language":"Mongolian","langKey":"mn-MN"},{"language":"Norwegian (Bokmål)","langKey":"nb-NO"},{"language":"Norwegian (Nynorsk)","langKey":"nn-NO"},{"language":"Persian","langKey":"fa-IR"},{"language":"Polish","langKey":"pl-PL"},{"language":"Portuguese (Brazil)","langKey":"pt-BR"},{"language":"Portuguese (Portugal)","langKey":"pt-PT"},{"language":"Romanian","langKey":"ro-RO"},{"language":"Russian","langKey":"ru-RU"},{"language":"Serbian","langKey":"sr-RS"},{"language":"Slovak","langKey":"sk-SK"},{"language":"Slovenian","langKey":"sl-SI"},{"language":"Spanish (Chile)","langKey":"es-CL"},{"language":"Spanish (Mexico)","langKey":"es-MX"},{"language":"Spanish (Spain)","langKey":"es-ES"},{"language":"Swedish","langKey":"sv-SE"},{"language":"Thai","langKey":"th-TH"},{"language":"Turkish","langKey":"tr-TR"},{"language":"Ukrainian","langKey":"uk-UA"},{"language":"Vietnamese","langKey":"vi-VN"},{"language":"Welsh","langKey":"cy-GB"},{"language":"Afrikaans","langKey":"af-ZA"},{"language":"Arabic","langKey":"ar"},{"language":"Basque","langKey":"eu"},{"language":"Bulgarian","langKey":"bg-BG"},{"language":"Catalan","langKey":"ca-AD"},{"language":"Chinese (PRC)","langKey":"zh-CN"},{"language":"Chinese (Taiwan)","langKey":"zh-TW"},{"language":"Croatian","langKey":"hr-HR"},{"language":"Czech","langKey":"cs-CZ"},{"language":"Danish","langKey":"da-DK"},{"language":"Dutch","langKey":"nl-NL"},{"language":"English (UK)","langKey":"en-GB"},{"language":"English (US)","langKey":"en-US"},{"language":"Estonian","langKey":"et-EE"},{"language":"Finnish","langKey":"fi-FI"},{"language":"French (Canada)","langKey":"fr-CA"},{"language":"French (France)","langKey":"fr-FR"},{"language":"German (Austria)","langKey":"de-AT"},{"language":"German (Germany)","langKey":"de-DE"},{"language":"German (Switzerland)","langKey":"de-CH"},{"language":"Greek","langKey":"el-GR"},{"language":"Hebrew","langKey":"he-IL"},{"language":"Hindi","langKey":"hi-IN"},{"language":"Hungarian","langKey":"hu-HU"},{"language":"Icelandic","langKey":"is-IS"},{"language":"Indonesian","langKey":"id-ID"},{"language":"Italian","langKey":"it-IT"},{"language":"Japanese","langKey":"ja-JP"},{"language":"Khmer","langKey":"km-KH"},{"language":"Korean","langKey":"ko-KR"},{"language":"Latin","langKey":"la"},{"language":"Latvian","langKey":"lv-LV"},{"language":"Lithuanian","langKey":"lt-LT"},{"language":"Mongolian","langKey":"mn-MN"},{"language":"Norwegian (Bokmål)","langKey":"nb-NO"},{"language":"Norwegian (Nynorsk)","langKey":"nn-NO"},{"language":"Persian","langKey":"fa-IR"},{"language":"Polish","langKey":"pl-PL"},{"language":"Portuguese (Brazil)","langKey":"pt-BR"},{"language":"Portuguese (Portugal)","langKey":"pt-PT"},{"language":"Romanian","langKey":"ro-RO"},{"language":"Russian","langKey":"ru-RU"},{"language":"Serbian","langKey":"sr-RS"},{"language":"Slovak","langKey":"sk-SK"},{"language":"Slovenian","langKey":"sl-SI"},{"language":"Spanish (Chile)","langKey":"es-CL"},{"language":"Spanish (Mexico)","langKey":"es-MX"},{"language":"Spanish (Spain)","langKey":"es-ES"},{"language":"Swedish","langKey":"sv-SE"},{"language":"Thai","langKey":"th-TH"},{"language":"Turkish","langKey":"tr-TR"},{"language":"Ukrainian","langKey":"uk-UA"},{"language":"Vietnamese","langKey":"vi-VN"},{"language":"Welsh","langKey":"cy-GB"}]');

  selectedCitationStyle = 'modern-language-association';
  selectedCitationLanguage = 'en-US'
  selectedTitleLanguage = 'en-US'
  alternateTitleText = ''
  isCitationLoading = false;

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

  async getSpecificData(obj: ZoteroItem, parent: any) {
    this.user = JSON.parse(this.authService.getToken() || '{}');
    if (this.user.role_name === 'Admin' || this.user.role_name === 'Editor') this.hasPermission = true;

    document.getElementById('info-tab')?.click();

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

            /// Update the AIEGL Source
            this.zoteroObject.shortTitle[0].source = 'AIEGL'
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
      this.getCitation();
      this.parentComponent = parent;
      //console.log(resp)
    })

    this.getAltTitleByCallNo();
    
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
          if (index > -1) {
            this.zoteroObject.creators[index].VIAF.value = resp[0].VIAF;
            this.zoteroObject.creators[index].ORCID.value = resp[0].ORCID;
          }
        }
      }
    });
  }

  async getCitation() {
    this.isCitationLoading = true;
    (document.getElementById('citationContent') as HTMLElement).innerHTML = '';
    let cit = await this.zoteroAPI.citation('bib', this.zoteroObject.key, this.selectedCitationStyle, this.selectedCitationLanguage);
    (document.getElementById('citationContent') as HTMLElement).innerHTML = cit;
    this.isCitationLoading = false
  }

  copy(format: any) {
    let value = '';

    if (format !== 'html') {
      value = (document.getElementById('citationContent') as HTMLElement).innerText;
    }
    else {
      value = (document.getElementById('citationContent') as HTMLElement).innerHTML;
    }
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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

        //this.updateRDFData()
      })
    }
    else {
      item.value[item.value.length - 1].invalid = true;
    }
  }

  async updateRDFData() {
    //console.log(this.parentComponent.currentSelectedRecord)
    this.apiService.updateRDFData(this.parentComponent.currentSelectedRecord).subscribe(resp => {
      console.log(resp);  
    })
  }

  getFirstAbbr(item: any) {
    return item[0] as string;
  }

  getCreators(value: any) {
    let creators: Array<Creator> = new Array();
    for (let c of value) {
      creators.push(new Creator(c));
    }
    creators = this.sortByCol(creators, 'creatorType')
    return creators;
  }

  sortByCol(creators: Creator[], colName: any) {
    creators.sort(function (a: any, b: any) {
      const nameA = a[colName].toUpperCase() // ignore upper and lowercase
      const nameB = b[colName].toUpperCase() // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return creators;
  }

  trackByIdFn(item: any): number {
    return item.firstName;
  }

  saveAlterTitle() {
    if (this.alternateTitleText !== '') {
      document.getElementById('txtTitle')?.classList.remove('horizontal-shake');
      let callNumber = this.zoteroObject.callNumber;
      let altTitle = this.alternateTitleText;
      let lang = document.getElementById('selLang')?.innerText.replace(/(\r\n|\n|\r|\t)/gm, "").replace("×", "");
      let langKey = this.selectedTitleLanguage;
      let obj: any = { callNumber: callNumber, altTitle: altTitle, lang: lang, langKey: langKey };
      this.apiService.addAlternateTitle(obj).subscribe(resp => {
        if (resp === 'success') {
          this.getAltTitleByCallNo();
          this.selectedTitleLanguage = 'en-US';
          this.alternateTitleText = '';
          this.showToast('Alternate title added.', 'bg-success');
          document.getElementById('btnAltTitleClose')?.click();
        }
        else {
          this.showToast('Exception occured while saving info.', 'bg-danger')
        }
      })
    }
    else {
      document.getElementById('txtTitle')?.classList.remove('horizontal-shake');
      document.getElementById('txtTitle')?.offsetHeight;
      document.getElementById('txtTitle')?.classList.add('horizontal-shake');
    }
  }

  getAltTitleByCallNo() {
    this.apiService.getAlternateTitle(this.zoteroObject.callNumber).subscribe(resp => {
      if (resp.length > 0)
        this.zoteroObject.altTitle = resp;//resp.map((x: any) => x.title);

      this.alternateTitles = resp;
    });
  }

  ////////////////////////////////////////////////////////////////
  showToast(msg: any, color: any) {
    document.getElementById('divError')?.classList.add('show')
    document.getElementById('divError')?.classList.add(color)
    this.errorMessage = msg;
    setTimeout(() => {
      document.getElementById('divError')?.classList.remove('show')
      document.getElementById('divError')?.classList.remove(color)
    }, 10000);
  }
}
