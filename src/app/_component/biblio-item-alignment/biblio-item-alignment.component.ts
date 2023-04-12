import { Component, OnInit } from '@angular/core';
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
  }

  checkURL() {
    if (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(this.zoteroURL)) {
      this.invalidURL = false;
    }
    else {
      this.invalidURL = true;
    }
  }

  async fetch() {
    if (!this.invalidURL && this.zoteroURL !== '') {
      let apiNumber = this.zoteroURL.replace(/[^0-9]/g, "");
      let items: any = null;
      if (this.zoteroURL.includes('groups') && apiNumber) {
        this.invalidURL = false;
        this.isFetching = true;
        this.fetchingPercentage = this.zoteroAPI.fetchingPercentage;
        if (localStorage.getItem(apiNumber) !== undefined && localStorage.getItem(apiNumber) !== null) {
          items = JSON.parse(localStorage.getItem(apiNumber) || '{}');
        }
        else {
          items = await this.zoteroAPI.fetchURL(apiNumber);
        }

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
    for (let target of this.allOtherBiblioData) {
      for (let source of this.allSourceBiblioData) {
        currentSource = source;
        if (source.title === target.title) {
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

      if (matchedBiblio) {
        this.matchedBibliography.push(currentSource);
        matchedBiblio = false;
      }
      else
        this.notMatchedBibliography.push(target);
    }
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
