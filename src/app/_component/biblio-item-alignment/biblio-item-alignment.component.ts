import { Component, OnInit, ViewChild } from '@angular/core';
import { ZoteroItem } from 'src/app/_models/zotero-item.model';
import { AuthService } from 'src/app/_service/auth.service';
import { ZoteroSyncService } from 'src/app/_service/zotero-sync.service';

@Component({
  selector: 'app-biblio-item-alignment',
  templateUrl: './biblio-item-alignment.component.html',
  styleUrls: ['./biblio-item-alignment.component.scss']
})
export class BiblioItemAlignmentComponent implements OnInit {
  loginUser = null;
  zoteroURL = ''
  invalidURL = false;
  isFetching = false;
  fetchingPercentage = 0;
  allOtherBiblioData: Array<ZoteroItem> = new Array();
  allSourceBiblioData: Array<ZoteroItem> = new Array();
  errorMessage = '';
  matchedBibliography: Array<ZoteroItem> = new Array();
  notMatchedBibliography: Array<ZoteroItem> = new Array();
  otherLibAPIKey: string = '';
  currentRowCompareBtn: any = -1;
  otherLibCallNumber: string = '';
  @ViewChild('customBiblioList') customBiblioList: any;
  @ViewChild('zoteroBiblioList') zoteroBiblioList: any;
  isNotMatchedItem = false;
  isUpdateAllBtn = false;

  txtSearchMatched = '';
  txtSearchNotMatched = '';

  constructor(
    private authService: AuthService,
    public zoteroAPI: ZoteroSyncService
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticate()) {
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
    }
    else
      this.loginUser = null;

    if (localStorage.getItem('libURL') !== undefined && localStorage.getItem('libURL') !== null) {
      this.zoteroURL = JSON.parse(localStorage.getItem('libURL') || '{}').libURL;
    }
  }

  checkURL() {
    if (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(this.zoteroURL)) {
      this.invalidURL = false;
    }
    else {
      this.invalidURL = true;
    }
  }

  changeTextMatched() {

  }

  async fetch() {
    if (!this.invalidURL && this.zoteroURL !== '') {
      let apiNumber = this.zoteroURL.replace(/[^0-9]/g, "");
      let items: any = null;
      if (this.zoteroURL.includes('groups') && apiNumber) {
        this.invalidURL = false;
        this.isFetching = true;
        this.fetchingPercentage = this.zoteroAPI.fetchingPercentage;
        // if (localStorage.getItem(apiNumber) !== undefined && localStorage.getItem(apiNumber) !== null) {
        //   items = JSON.parse(localStorage.getItem(apiNumber) || '{}').items;

        //   if (JSON.parse(localStorage.getItem('libURL') || '{}').libURL !== this.zoteroURL) {
        //     localStorage.setItem('libURL', JSON.stringify({ libURL: this.zoteroURL, apiKey: '' }));
        //   }
        // }
        // else {
        items = await this.zoteroAPI.fetchURL(apiNumber, this.zoteroURL);
        // }

        if (items.length > 0) {
          this.allOtherBiblioData = this.convertJSONToArray(items);
          this.allSourceBiblioData = this.convertJSONToArray(this.zoteroAPI.getPreviousVersion().items)
          this.compareBibliographyItems();
          //this.sortByCol('title', null!);
        }
        else {
          this.showToast('No zotero items found', 'bg-danger')
        }
        this.isFetching = false;
      }
      else {
        this.invalidURL = true;
      }
    }
  }

  compareBibliographyItems() {
    let matchedBiblio = false;
    let currentSource: any = null;
    this.matchedBibliography = []
    this.notMatchedBibliography = []
    let isCallNumberExist: any = null;
    for (let target of this.allOtherBiblioData) {
      if (target.title === '')
        continue;
      isCallNumberExist = this.getCallNumberExist(target.tags, target.callNumber);
      if (isCallNumberExist === null) {
        for (let source of this.allSourceBiblioData) {
          currentSource = source;
          if (source.title.includes(target.title) || target.title.includes(source.title)) {
            for (let c of source.creators) {
              let creatorFound = target.creators.filter(x => (x.firstName === c.firstName && x.lastName === c.lastName) ||
                (x.fullName === c.fullName)
              );
              if (creatorFound.length > 0) {
                let splitSourceDate = source.date.split("-");
                let splitTargetDate = target.date.split("-");
                if (splitSourceDate[0].trim() === splitTargetDate[0].trim()) {
                  matchedBiblio = true;
                }
              }
            }
          }
          if (matchedBiblio)
            break;
        }
      }

      if (matchedBiblio) {
        this.matchedBibliography.push(currentSource);
        matchedBiblio = false;
      }
      else {
        if (isCallNumberExist !== null && isCallNumberExist.callNumber === '')
          this.notMatchedBibliography.push(target);
        else if (!matchedBiblio && isCallNumberExist === null)
          this.notMatchedBibliography.push(target);
      }
    }
  }

  getCallNumberExist(tags: any, callNumber: any) {
    if (tags.length === 0 && callNumber === '')
      return null;
    else if (tags.filter((x: any) => x.tag.indexOf('callNumber') > -1).length > 0) {
      return { callNumber: tags.filter((x: any) => x.tag.indexOf('callNumber') > -1)[0].tag.split(':')[1].trim() };
    }
    else if(callNumber !== '' && callNumber.startsWith('epig'))
    {
      return { callNumber: callNumber };
    }

    return null;
  }

  compare(item: any, index: any) {
    this.currentRowCompareBtn = index;
    let biblioSourceItem = this.getSpecificBiblioItem(item, 'biblioList')
    this.customBiblioList.getSpecificData(biblioSourceItem, 'biblio');

    let biblioTargetItem = this.getSpecificBiblioItem(item, 'zoteroList')
    this.zoteroBiblioList.getSpecificData(biblioTargetItem, 'zotero');

    this.isFetching = false;
    this.otherLibCallNumber = '';
    this.isNotMatchedItem = false;
    this.removeShakeClass()
  }

  getSpecificBiblioItem(item: any, origin: any) {
    let currentSource: any = null;
    if ('biblioList' === origin) {
      currentSource = this.allSourceBiblioData.find((x: any) => x.callNumber === item.callNumber);
    }
    else {
      let found = false;
      for (let source of this.allOtherBiblioData) {
        if (source.title.includes(item.title) || item.title.includes(source.title)) {
          for (let c of source.creators) {
            let creatorFound = item.creators.filter((x: any) => (x.firstName === c.firstName && x.lastName === c.lastName) ||
              (x.fullName === c.fullName)
            );
            if (creatorFound.length > 0) {
              let splitSourceDate = source.date.split("-");
              let splitTargetDate = item.date.split("-");
              if (splitSourceDate[0].trim() === splitTargetDate[0].trim()) {
                currentSource = source;
                found = true;
                break;
              }
            }
          }
          if (found)
            break;
        }
      }
    }
    return currentSource;
  }

  convertJSONToArray(data: any) {
    let allItems: Array<ZoteroItem> = new Array();
    for (let d of data) {
      if (d.itemType !== 'attachment') {
        let zoteroItem: ZoteroItem = new ZoteroItem(d);
        if (d.itemType !== 'note')
          allItems.push(zoteroItem)
      }
    }
    return allItems;
  }

  getItemTypeIcon(itemType: any) {
    if (itemType.toLowerCase().includes('book'))
      return 'bi bi-book';
    else if (itemType.toLowerCase().includes('journal'))
      return 'bi bi-journals';
    else if (itemType.toLowerCase().includes('web'))
      return 'bi bi-globe2'
    else if (itemType.toLowerCase().includes('manuscript'))
      return 'bi bi-pencil-square'
    return '';
  }

  removeAllSortingIcons() {
    Array.from(document.getElementsByClassName('bi-chevron-up')).forEach(ele => {
      ele.classList.remove('bi-chevron-up');
    })
    Array.from(document.getElementsByClassName('bi-chevron-down')).forEach(ele => {
      ele.classList.remove('bi-chevron-down');
    })
  }

  sortByCol(colName: any, event: Event) {
    let sortDirection = '';
    let element;
    if (event !== null) {
      console.log((event.target as HTMLElement).children);
      element = ((event.target) as HTMLElement).children[0]
      sortDirection = element.className;
    }

    if (sortDirection.indexOf('bi-chevron-up') > -1)  // Descending order
    {
      if (event !== null) this.removeAllSortingIcons();
      this.allOtherBiblioData = this.allOtherBiblioData.sort(function (a: any, b: any) {
        const nameA = colName !== 'creators' ? a[colName].toUpperCase() : a.getCreators(); // ignore upper and lowercase
        const nameB = colName !== 'creators' ? b[colName].toUpperCase() : b.getCreators(); // ignore upper and lowercase
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        // call number must be equal
        return 0;
      });
      element?.classList.add('bi-chevron-down')
    }
    else {
      if (event !== null) this.removeAllSortingIcons();
      this.allOtherBiblioData = this.allOtherBiblioData.sort(function (a: any, b: any) {
        const nameA = colName !== 'creators' ? a[colName].toUpperCase() : a.getCreators(); // ignore upper and lowercase
        const nameB = colName !== 'creators' ? b[colName].toUpperCase() : b.getCreators(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // call number must be equal
        return 0;
      });
      element?.classList.add('bi-chevron-up')
    }
  }
  /////////////////////////////////////////////////////////////////
  ///////////// Add tag as callNumber to zotero
  async Accept() {
    this.isFetching = true;
    let callNumber = this.customBiblioList.zoteroObject.callNumber;
    let zoteroObj = this.zoteroBiblioList.zoteroObject;
    let tagCallNumber = { tag: `callNumber: ${callNumber}` };
    let apiKey = JSON.parse(localStorage.getItem('libURL') || '{}').apiKey;
    let apiNumber = this.zoteroURL.replace(/[^0-9]/g, "");
    try {
      if (apiKey !== '') {
        await this.zoteroAPI.updateOtherLibTagsWithCallNumber(this.zoteroURL, zoteroObj, apiKey, tagCallNumber, callNumber);
        this.matchedBibliography = this.matchedBibliography.filter(x => x.key !== this.customBiblioList.zoteroObject.key);
        let obj = JSON.parse(localStorage.getItem(apiNumber) || '{}');
        let itemIndex = obj.items.findIndex((x: any) => x.key === zoteroObj.key);
        obj.items[itemIndex].tags.push(tagCallNumber);
        localStorage.setItem(apiNumber, JSON.stringify(obj));

        document.getElementById('btnModalCompareClose')?.click();
      }
      else {
        document.getElementById('btnOpenModalAPIKey')?.click();
      }
      this.isFetching = false;
    } catch (error: any) {
      this.isFetching = false;
      if (error.message.includes('403: Forbidden'))
        this.showToast('Invalid API key. Permission denied.', 'bg-danger')
      else
        this.showToast(error.message, 'bg-danger');
    }

    //console.log(this.zoteroBiblioList.zoteroObject)
  }

  SaveOtherLibAPIKey() {
    if (this.otherLibAPIKey !== '') {
      let url = JSON.parse(localStorage.getItem('libURL') || '{}');
      if (url.apiKey === '') {
        let obj = { libURL: '', apiKey: '' };
        obj.libURL = this.zoteroURL;
        obj.apiKey = this.otherLibAPIKey;
        localStorage.setItem('libURL', JSON.stringify(obj));
      }
      document.getElementById('btnAPIKeyClose')?.click();
      document.getElementById(`btnOpenModal-${this.currentRowCompareBtn}`)?.click();
      //this.Accept();
    }
    else {
      this.showToast('Please enter API key', 'bg-danger')
    }
  }

  async UpdateAll() {
    this.zoteroAPI.fetchingPercentage = 0;
    let apiKey = JSON.parse(localStorage.getItem('libURL') || '{}').apiKey;
    if (apiKey !== '') {
      let allNotMachedItems = this.notMatchedBibliography.map(a => Object.assign(new ZoteroItem(a), a));
      this.zoteroAPI.otherLibItemsCount = allNotMachedItems.length;
      this.isUpdateAllBtn = true;
      this.isFetching = true;
      for (let item of allNotMachedItems) {
        await this.waitFor(item, 1);
        this.zoteroAPI.fetchingPercentage++;
      }
      this.isUpdateAllBtn = false;
      this.isFetching = false;
      this.showToast('Update all callNumber to your library and FAIR Bibliography.', 'bg-success');
    } else {
      document.getElementById('btnOpenModalAPIKey')?.click();
    }
  }

  async waitFor(item: any, seconds: any) {
    await this.updateNotMatchedCallNumberSync(item, -1);
    let s = '';
    // return new Promise((resolve, reject) => {
    //   setTimeout(resolve, seconds * 1);
    // });
  }

  async updateNotMatchedCallNumberSync(item: any, index: any) {
    let apiKey = JSON.parse(localStorage.getItem('libURL') || '{}').apiKey;
    if (apiKey !== '') {
      this.isFetching = true;
      this.isNotMatchedItem = true;
      let callNumber = this.getLastCallNumber();
      let replaced = parseInt(callNumber.replace(/\D/g, ''));
      replaced++;
      callNumber = 'epig' + replaced;
      let otherLibNumber = this.zoteroURL.replace(/[^0-9]/g, "");
      let items = JSON.parse(localStorage.getItem(otherLibNumber) || '{}').items;
      let otherLibItem = items.find((x: any) => x.key === item.key);
      otherLibItem.callNumber = callNumber;
      let inserted = await this.zoteroAPI.insert(otherLibItem);
      this.zoteroBiblioList.zoteroObject = item;
      this.otherLibCallNumber = callNumber;
      await this.SaveOtherLibCallNumber()
      await this.syncSourceData();

      if (!this.isUpdateAllBtn)
        this.isFetching = false;
    }
    else {
      document.getElementById('btnOpenModalAPIKey')?.click();
    }
  }

  async syncSourceData() {
    let data: any = await this.zoteroAPI.sync();
    if (data !== null) {
      if (typeof data === 'string') {
        this.showToast(data, 'bg-danger');
        data = this.zoteroAPI.getPreviousVersion()
      }
      this.allSourceBiblioData = this.convertJSONToArray(data.items);
    }
  }

  getLastCallNumber() {
    let filtered = this.allSourceBiblioData.filter(x => x.callNumber !== '');
    let maxCallNumber = filtered.sort(function (a: any, b: any) {
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
    return maxCallNumber[0].callNumber;
  }

  saveCallNumNotMatched(data: ZoteroItem) {
    this.otherLibCallNumber = '';
    this.isNotMatchedItem = true;
    this.zoteroBiblioList.zoteroObject = data;
    this.removeShakeClass()
  }

  async SaveOtherLibCallNumber() {
    if (this.otherLibCallNumber !== '') {
      this.isFetching = true;
      let callNumber = this.otherLibCallNumber;
      let zoteroObj = this.zoteroBiblioList.zoteroObject;
      let tagCallNumber = { tag: `callNumber: ${callNumber}` };
      let apiKey = JSON.parse(localStorage.getItem('libURL') || '{}').apiKey;
      let apiNumber = this.zoteroURL.replace(/[^0-9]/g, "");
      try {
        if (apiKey !== '') {
          await this.zoteroAPI.updateOtherLibTagsWithCallNumber(this.zoteroURL, zoteroObj, apiKey, tagCallNumber, callNumber);
          if (this.customBiblioList.zoteroObject !== null && !this.isNotMatchedItem) {
            this.matchedBibliography = this.matchedBibliography.filter(x => x.key !== this.customBiblioList.zoteroObject.key);
          }
          if (this.isNotMatchedItem) {
            this.notMatchedBibliography = this.notMatchedBibliography.filter(x => x.key !== zoteroObj.key);
          }
          let obj = JSON.parse(localStorage.getItem(apiNumber) || '{}');
          let itemIndex = obj.items.findIndex((x: any) => x.key === zoteroObj.key);
          obj.items[itemIndex].tags.push(tagCallNumber);
          localStorage.setItem(apiNumber, JSON.stringify(obj));

          document.getElementById('btnCloseCallNumberModal')?.click();
          if (!this.isUpdateAllBtn)
            this.showToast('callNumber added to your library', 'bg-success');
        }
        else {
          document.getElementById('btnOpenModalAPIKey')?.click();
        }
        this.otherLibCallNumber = '';
        if (!this.isUpdateAllBtn)
          this.isFetching = false;
      } catch (error: any) {
        this.isFetching = false;
        if (error.message.includes('403: Forbidden'))
          this.showToast('Invalid API key. Permission denied.', 'bg-danger')
        else
          this.showToast(error.message, 'bg-danger');
      }
    }
    else {
      document.getElementById('txtOtherCallNumber')?.classList.remove('horizontal-shake');
      document.getElementById('txtOtherCallNumber')?.offsetHeight;
      document.getElementById('txtOtherCallNumber')?.classList.add('horizontal-shake');
    }
  }

  addItemToUnMatchedList() {
    let apiNumber = this.zoteroURL.replace(/[^0-9]/g, "");
    let callNumber = '';
    let tagCallNumber = { tag: `callNumber: ${callNumber}` };
    let zoteroObj = this.zoteroBiblioList.zoteroObject;
    this.matchedBibliography = this.matchedBibliography.filter(x => x.key !== this.customBiblioList.zoteroObject.key);
    let obj = JSON.parse(localStorage.getItem(apiNumber) || '{}');
    let itemIndex = obj.items.findIndex((x: any) => x.key === zoteroObj.key);
    obj.items[itemIndex].tags.push(tagCallNumber);
    localStorage.setItem(apiNumber, JSON.stringify(obj));
    this.notMatchedBibliography.push(zoteroObj)
    document.getElementById('btnCloseCallNumberModal')?.click();
  }

  cancel(opt: any) {
    if (opt === 'back') {
      document.getElementById(`btnOpenModal-${this.currentRowCompareBtn}`)?.click();
    }
  }
  removeShakeClass() {
    Array.from(document.getElementsByClassName('horizontal-shake') as HTMLCollection).forEach((ele: any) => {
      ele.classList.remove('horizontal-shake');
    })
  }

  clearCache() {
    if (this.zoteroURL !== '') {
      let apiNumber = this.zoteroURL.replace(/[^0-9]/g, "");
      localStorage.removeItem(apiNumber);
      localStorage.removeItem('libURL')
      location.reload();
    }
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
