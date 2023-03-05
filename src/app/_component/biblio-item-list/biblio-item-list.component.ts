import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Creator } from '../../_models/creator.model';
import { ZoteroItem } from '../../_models/zotero-item.model';
//const { default: api } = require('zotero-api-client');

@Component({
  selector: 'app-biblio-item-list',
  templateUrl: './biblio-item-list.component.html',
  styleUrls: ['./biblio-item-list.component.scss']
})
export class BiblioItemListComponent implements OnInit {
  @Input() biblioData: Array<ZoteroItem> = new Array();
  //creator: Creator = new Creator(null);
  start = 0;
  limit = 30;
  @Input() loading = false;
  loadingEnd = false;
  totalRecord = 0;
  @Input() biblioItemInfoComp: any;
  @Input() canActive: boolean = false;
  @Input() searchText: string = '';
  @Input() mainSearchBar: string = '';
  @Input() lastCallNumber: string = '';
  isShown = false;

  public currentSelectedRecord: any = null;

  constructor(
    private router: Router
  ) {
  }
  ngOnInit(): void {
    let interval = setInterval(() => {
      if (this.biblioData.length > 0) {
        clearInterval(interval);
        this.sortByCol('title', null!);
      }
    }, 500)

  }

  reInit() {
    this.isShown = false;
    setTimeout(() => {
      this.isShown = true;
    });
  }

  getSpecificData(obj: ZoteroItem) {
    console.log(obj)
    this.currentSelectedRecord = obj;
    this.biblioItemInfoComp.getSpecificData(obj);
  }

  getCreators(value: any) {
    let creators: Array<Creator> = new Array();
    for (let c of value) {
      creators.push(new Creator(c));
    }
    return creators;
  }

  getItemTypeIcon(itemType: any) {
    if (itemType.toLowerCase().indexOf('book') > -1)
      return 'bi bi-book';
    else if (itemType.toLowerCase().indexOf('journal') > -1)
      return 'bi bi-journals';
    else if (itemType.toLowerCase().indexOf('web') > -1)
      return 'bi bi-globe2'
    return '';
  }

  sortByCol(colName: any, event: Event) {
    let sortDirection = '';
    let element;
    if (event !== null) {
      Array.from(document.getElementsByClassName('bi-chevron-up')).forEach(ele=>{
        ele.classList.remove('bi-chevron-up');
      })
      Array.from(document.getElementsByClassName('bi-chevron-down')).forEach(ele=>{
        ele.classList.remove('bi-chevron-down');
      })
      console.log((event.target as HTMLElement).children);
      element = ((event.target) as HTMLElement).children[0]
      sortDirection = element.className;
    }
    this.biblioData = this.biblioData.sort(function (a: any, b: any) {
      try {
        const nameA = a[colName].toUpperCase(); // ignore upper and lowercase
        const nameB = b[colName].toUpperCase(); // ignore upper and lowercase
        if (sortDirection.indexOf('bi-chevron-up') > -1)  // Descending order
        {
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
        }
        else // Ascending order
        {
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        }

      } catch (error) {
        console.log(a, b)
      }
      // call number must be equal
      return 0;
    });

    if (sortDirection.indexOf('bi-chevron-up') > -1) {
      element?.classList.remove('bi-chevron-up')
      element?.classList.add('bi-chevron-down');
    }
    else
    {
      element?.classList.remove('bi-chevron-down')
      element?.classList.add('bi-chevron-up');
    }
  }

  closeModal() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
