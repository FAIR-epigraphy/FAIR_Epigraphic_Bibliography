import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { ZoteroSyncService } from 'src/app/_service/zotero-sync.service';

@Component({
  selector: 'app-abbreviation-list',
  templateUrl: './abbreviation-list.component.html',
  styleUrls: ['./abbreviation-list.component.scss']
})
export class AbbreviationListComponent implements OnInit {
  loginUser = null;
  biblioData: any = [];
  citations: any = [];
  filteredCitationData: any = [];
  citationLanguage: any = JSON.parse('[{"language":"Afrikaans","langKey":"af-ZA"},{"language":"Arabic","langKey":"ar"},{"language":"Basque","langKey":"eu"},{"language":"Bulgarian","langKey":"bg-BG"},{"language":"Catalan","langKey":"ca-AD"},{"language":"Chinese (PRC)","langKey":"zh-CN"},{"language":"Chinese (Taiwan)","langKey":"zh-TW"},{"language":"Croatian","langKey":"hr-HR"},{"language":"Czech","langKey":"cs-CZ"},{"language":"Danish","langKey":"da-DK"},{"language":"Dutch","langKey":"nl-NL"},{"language":"English (UK)","langKey":"en-GB"},{"language":"English (US)","langKey":"en-US"},{"language":"Estonian","langKey":"et-EE"},{"language":"Finnish","langKey":"fi-FI"},{"language":"French (Canada)","langKey":"fr-CA"},{"language":"French (France)","langKey":"fr-FR"},{"language":"German (Austria)","langKey":"de-AT"},{"language":"German (Germany)","langKey":"de-DE"},{"language":"German (Switzerland)","langKey":"de-CH"},{"language":"Greek","langKey":"el-GR"},{"language":"Hebrew","langKey":"he-IL"},{"language":"Hindi","langKey":"hi-IN"},{"language":"Hungarian","langKey":"hu-HU"},{"language":"Icelandic","langKey":"is-IS"},{"language":"Indonesian","langKey":"id-ID"},{"language":"Italian","langKey":"it-IT"},{"language":"Japanese","langKey":"ja-JP"},{"language":"Khmer","langKey":"km-KH"},{"language":"Korean","langKey":"ko-KR"},{"language":"Latin","langKey":"la"},{"language":"Latvian","langKey":"lv-LV"},{"language":"Lithuanian","langKey":"lt-LT"},{"language":"Mongolian","langKey":"mn-MN"},{"language":"Norwegian (Bokmål)","langKey":"nb-NO"},{"language":"Norwegian (Nynorsk)","langKey":"nn-NO"},{"language":"Persian","langKey":"fa-IR"},{"language":"Polish","langKey":"pl-PL"},{"language":"Portuguese (Brazil)","langKey":"pt-BR"},{"language":"Portuguese (Portugal)","langKey":"pt-PT"},{"language":"Romanian","langKey":"ro-RO"},{"language":"Russian","langKey":"ru-RU"},{"language":"Serbian","langKey":"sr-RS"},{"language":"Slovak","langKey":"sk-SK"},{"language":"Slovenian","langKey":"sl-SI"},{"language":"Spanish (Chile)","langKey":"es-CL"},{"language":"Spanish (Mexico)","langKey":"es-MX"},{"language":"Spanish (Spain)","langKey":"es-ES"},{"language":"Swedish","langKey":"sv-SE"},{"language":"Thai","langKey":"th-TH"},{"language":"Turkish","langKey":"tr-TR"},{"language":"Ukrainian","langKey":"uk-UA"},{"language":"Vietnamese","langKey":"vi-VN"},{"language":"Welsh","langKey":"cy-GB"},{"language":"Afrikaans","langKey":"af-ZA"},{"language":"Arabic","langKey":"ar"},{"language":"Basque","langKey":"eu"},{"language":"Bulgarian","langKey":"bg-BG"},{"language":"Catalan","langKey":"ca-AD"},{"language":"Chinese (PRC)","langKey":"zh-CN"},{"language":"Chinese (Taiwan)","langKey":"zh-TW"},{"language":"Croatian","langKey":"hr-HR"},{"language":"Czech","langKey":"cs-CZ"},{"language":"Danish","langKey":"da-DK"},{"language":"Dutch","langKey":"nl-NL"},{"language":"English (UK)","langKey":"en-GB"},{"language":"English (US)","langKey":"en-US"},{"language":"Estonian","langKey":"et-EE"},{"language":"Finnish","langKey":"fi-FI"},{"language":"French (Canada)","langKey":"fr-CA"},{"language":"French (France)","langKey":"fr-FR"},{"language":"German (Austria)","langKey":"de-AT"},{"language":"German (Germany)","langKey":"de-DE"},{"language":"German (Switzerland)","langKey":"de-CH"},{"language":"Greek","langKey":"el-GR"},{"language":"Hebrew","langKey":"he-IL"},{"language":"Hindi","langKey":"hi-IN"},{"language":"Hungarian","langKey":"hu-HU"},{"language":"Icelandic","langKey":"is-IS"},{"language":"Indonesian","langKey":"id-ID"},{"language":"Italian","langKey":"it-IT"},{"language":"Japanese","langKey":"ja-JP"},{"language":"Khmer","langKey":"km-KH"},{"language":"Korean","langKey":"ko-KR"},{"language":"Latin","langKey":"la"},{"language":"Latvian","langKey":"lv-LV"},{"language":"Lithuanian","langKey":"lt-LT"},{"language":"Mongolian","langKey":"mn-MN"},{"language":"Norwegian (Bokmål)","langKey":"nb-NO"},{"language":"Norwegian (Nynorsk)","langKey":"nn-NO"},{"language":"Persian","langKey":"fa-IR"},{"language":"Polish","langKey":"pl-PL"},{"language":"Portuguese (Brazil)","langKey":"pt-BR"},{"language":"Portuguese (Portugal)","langKey":"pt-PT"},{"language":"Romanian","langKey":"ro-RO"},{"language":"Russian","langKey":"ru-RU"},{"language":"Serbian","langKey":"sr-RS"},{"language":"Slovak","langKey":"sk-SK"},{"language":"Slovenian","langKey":"sl-SI"},{"language":"Spanish (Chile)","langKey":"es-CL"},{"language":"Spanish (Mexico)","langKey":"es-MX"},{"language":"Spanish (Spain)","langKey":"es-ES"},{"language":"Swedish","langKey":"sv-SE"},{"language":"Thai","langKey":"th-TH"},{"language":"Turkish","langKey":"tr-TR"},{"language":"Ukrainian","langKey":"uk-UA"},{"language":"Vietnamese","langKey":"vi-VN"},{"language":"Welsh","langKey":"cy-GB"}]');

  selectedCitationStyle = 'modern-language-association';
  selectedCitationLanguage = 'en-US'
  isCitationLoading = false;

  constructor(
    // private router: Router,
    private authService: AuthService,
    private syncService: ZoteroSyncService,
    // private iterableDiffers: IterableDiffers,
    // private cd: ChangeDetectorRef,
    // private biblAPI: BiblApiService,
  ) { }

  ngOnInit() {
    if (this.authService.isAuthenticate()) {
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
    }
    else
      this.loginUser = null;

    this.getAllBiblioCitationsStyle();
    this.getAllBiblioData();
  }

  async getAllBiblioData() {
    this.biblioData = this.syncService.getPreviousVersion().items;
    this.getCitation();
    //console.log(this.data)
  }

  async getAllBiblioCitationsStyle() {
    this.citations = await this.syncService.getAllBiblioCitationStyles();
  }

  async getCitation() {
    this.isCitationLoading = true;
    this.filteredCitationData = [];
    let lang = this.selectedCitationLanguage;
    let style = this.selectedCitationStyle;

    if (sessionStorage.getItem('abbreviations') !== undefined && sessionStorage.getItem('abbreviations') !== null) {
      let abbrStore: any = JSON.parse(sessionStorage.getItem('abbreviations') || '{}');
      let isExist = abbrStore.filter((x: any) => (x.citationStyle === style && x.citationLanguage === lang))
      if (isExist.length > 0) {
        this.filteredCitationData = abbrStore.filter((x: any) => x.citationStyle === this.selectedCitationStyle && x.citationLanguage === this.selectedCitationLanguage)[0].citData;
      }
      else {
        await this.getCitationFromAPI();
      }
    }
    else {
      await this.getCitationFromAPI();
    }

    this.isCitationLoading = false
  }

  async getCitationFromAPI() {
    let array: any = []
    let limit = 100;
    for (let start = 0; start < this.biblioData.length; start += limit) {
      let cit = await this.syncService.getAllcitations('bib', this.selectedCitationStyle, this.selectedCitationLanguage, start, limit);
      array.push(cit);
    }
    let data: any = [];
    for (let c of array) {
      for (let d of c) {
        if (this.biblioData.filter((x: any) => x.key === d.key).length > 0) {
          let citation = d.bib;
          let abbr = this.biblioData.filter((x: any) => x.key === d.key)[0].shortTitle;
          let callNumber = '';
          if (this.biblioData.filter((x: any) => x.key === d.key)[0].callNumber !== '')
            callNumber = this.biblioData.filter((x: any) => x.key === d.key)[0].callNumber;

          if (abbr !== undefined && abbr !== '')
            data.push({ abbr: abbr, citation: citation, callNumber: callNumber });
        }
      }
    }
    this.filteredCitationData = this.sortAsc(data, 'abbr');
    let storeAbbr: any = [];
    if (sessionStorage.getItem('abbreviations') !== undefined && sessionStorage.getItem('abbreviations') !== null)
      storeAbbr = JSON.parse(sessionStorage.getItem('abbreviations') || '{}');

    storeAbbr.push({ citData: this.filteredCitationData, citationStyle: this.selectedCitationStyle, citationLanguage: this.selectedCitationLanguage })
    sessionStorage.setItem('abbreviations', JSON.stringify(storeAbbr));
  }

  sortAsc(data: any, colName: any) {
    return data.sort(function (a: any, b: any) {
      const nameA = a[colName].toUpperCase()
      const nameB = b[colName].toUpperCase()
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // call number must be equal
      return 0;
    });
  }

  copy(format: any) {
    let value = '';

    if (format !== 'html') {
      value = (document.getElementById('citationContent') as HTMLElement).innerText;
    }
    else {
      value = (document.getElementById('citationContent') as HTMLElement).innerHTML;
    }
    value = `<table border="1">${value}</table>`;
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
    alert('copied!')
  }

  clearCache() {
    let input = confirm("Do you really want to clear your cache?");
    if (input) {
      sessionStorage.removeItem('abbreviations');
      location.reload();
    }
  }
}
