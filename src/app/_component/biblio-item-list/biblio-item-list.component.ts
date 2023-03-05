import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BiblApiService } from 'src/app/_service/bibl-api.service';
import { ZoteroSyncService } from 'src/app/_service/zotero-sync.service';
import { Creator } from '../../_models/creator.model';
import { ZoteroItem } from '../../_models/zotero-item.model';

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
  public parentChildRelations: any = [];

  constructor(
    private router: Router,
    private biblAPI: BiblApiService,
    private zoteroAPI: ZoteroSyncService
  ) {
  }
  ngOnInit(): void {
    this.biblAPI.getAllBiblioParentChildItems().subscribe(resp => {
      if (resp.length > 0) {
        this.parentChildRelations = resp;
        console.log(this.parentChildRelations);
      }
    })
    let interval = setInterval(() => {
      //let data: Array<ZoteroItem> = new Array();
      if (this.biblioData.length > 0) {
        for (let item of this.parentChildRelations) {
          let childIndex = this.biblioData.findIndex((x: any) => x.callNumber === item.child_callNumber);
          let parentIndex = this.biblioData.findIndex((x: any) => x.callNumber === item.parent_callNumber);
          if (childIndex > -1) {
            this.biblioData[parentIndex].children.push(this.biblioData[childIndex]);
            this.biblioData[childIndex].category = item.cat_name;
            this.biblioData.splice(childIndex, 1);
          }
        }

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

  expandChild(data: any, flag: boolean) {
    data.showChild = flag;
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
      this.biblioData = this.biblioData.sort(function (a: any, b: any) {
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
      this.biblioData = this.biblioData.sort(function (a: any, b: any) {
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

  closeModal() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  export(format: any, ext: any) {
    this.zoteroAPI.export(format, this.currentSelectedRecord.key, ext);
  }
}
