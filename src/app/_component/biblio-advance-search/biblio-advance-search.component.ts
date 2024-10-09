import { Component, ElementRef, Input, OnInit, ViewChild, IterableDiffers, ChangeDetectorRef, ViewChildren, ViewContainerRef, QueryList } from '@angular/core';
import { NgAsAdvancedSearchTerm, NgAsHeader, NgAsSearchTerm } from './models';

import { Router } from '@angular/router';
import { ZoteroItem } from '../../_models/zotero-item.model';
import { AuthService } from '../../_service/auth.service';
import { ZoteroSyncService } from '../../_service/zotero-sync.service';
import { ChildListComponent } from '../biblio-item-list/child-list/child-list.component';
import { BiblApiService } from 'src/app/_service/bibl-api.service';

@Component({
  selector: 'app-biblio-advance-search',
  templateUrl: './biblio-advance-search.component.html',
  styleUrls: ['./biblio-advance-search.component.scss'],
})
export class BiblioAdvanceSearchComponent implements OnInit {
  loginUser = null;
  allBiblioData: Array<ZoteroItem> = new Array();
  data: any = [];
  errorMessage = '';
  filteredData: any = [];
  public currentSelectedRecord: any = null;
  @Input() loading = false;
  @ViewChildren('dynamic', { read: ViewContainerRef }) childView!: QueryList<ViewContainerRef>;
  @ViewChild('biblioItemMore') biblioItemMore!: any;
  citations: any = [];
  totalItems: any = 0;
  public parentChildRelations: any = [];
  allAltTitles: any = [];
  // ***********************************************************************************************************
  // Inputs and outputs
  // ***********************************************************************************************************

  /** Array of fields the user can set advance rules for */
  headers: NgAsHeader[] = [
    { id: 'title', displayText: 'Title' },
    { id: 'callNumber', displayText: 'callNumber' },
    { id: 'shortTitle', displayText: 'Abbreviation' },
    { id: 'firstName', displayText: 'Creator First Name' },
    { id: 'lastName', displayText: 'Creator Last Name' },
    { id: 'date', displayText: 'Date' },
    // { id: 'weight', displayText: 'Weight', type: 'number' },
    // { id: 'spendings', displayText: 'Spendings' },
  ];
  /** What search term to have applied by default */
  @Input() defaultTerm!: NgAsSearchTerm;
  /** Array to apply the filters on */
  inputArray: any[] = new Array();
  /** Should the component enable filter saving UI */
  showFilterSaving: boolean = true;
  /** Terms saved by the user previously */
  @Input() savedFilters: NgAsSearchTerm[] = [];

  // ***********************************************************************************************************
  // User configured search term
  // ***********************************************************************************************************

  /** The terms the user configured */
  searchTerm: NgAsSearchTerm = {
    searchMode: 'advanced',
    simpleSearchTerm: '',
    advancedSearchLink: 'and',
    advancedTerms: [{ id: 0 }]
  };

  /** Counter that provides unique IDs for the advanced terms */
  advancedTermCounter = 1;

  constructor(
    private router: Router,
    private authService: AuthService,
    private syncService: ZoteroSyncService,
    private iterableDiffers: IterableDiffers,
    private cd: ChangeDetectorRef,
    private biblAPI: BiblApiService,
  ) {
    // For array input difference handling
    this.iterableDiffer = iterableDiffers.find([]).create();
  }

  // ***********************************************************************************************************
  // Input handling
  // ***********************************************************************************************************

  ngOnInit() {
    if (this.authService.isAuthenticate()) {
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
    }
    else
      this.loginUser = null;

    this.loading = true;
    this.biblAPI.getAllBiblioParentChildItems().subscribe(resp => {
      if (resp.length > 0) {
        this.parentChildRelations = resp;
      }
    })
    this.getAllBiblioCitationsStyle();
    this.allBiblioData = []
    this.getAllBiblioData();
  }

  ApplyAdvanceSearch() {
    this.inputArray = this.allBiblioData;

    // If no headers were proivded throw an error, since it is necessary for the advanced rule setup
    if (this.headers === null) { this.showToast(`Input 'headers' is required`, 'bg-danger'); throw new Error("Input 'headers' is required"); }

    // If a default term was provided apply it
    if (this.defaultTerm !== null && this.defaultTerm !== undefined) {
      this.searchTerm = this.defaultTerm;

      if (this.searchTerm.advancedTerms.length === 0) {
        this.searchTerm.advancedTerms.push({ id: 0 });
      }
    }

    // If saved terms were provided, check for a default there
    if (this.savedFilters.length !== 0) {
      this.savedFilters.forEach(f => {
        if (f.advancedTerms.length === 0) {
          f.advancedTerms.push({ id: 0 });
        }
      });

      const defFilter: any = this.savedFilters.find(f => f.isDefault === true);
      if (defFilter !== undefined) {
        this.termLoaded(defFilter.name);
      }
    }

    // Set output
    this.outputUpdate();
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  // ngDoCheck fails to detect array element changes by default. The following is a workaround
  iterableDiffer;

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.inputArray);
    if (changes) {
      // Input array changed, update output
      this.outputUpdate();
    }
  }

  // ***********************************************************************************************************
  // Output handling
  // ***********************************************************************************************************

  /** Term or input changed, update output */
  outputUpdate() {
    this.updateOutputArray();
  }

  /** Apply the search terms to the inputArray result */
  updateOutputArray() {
    // No usable input array was provided
    if (this.inputArray === null || this.inputArray.length === 0) {
      return;
    }

    // Call appropriate fitler function
    this.filteredData = this.advancedFilter();
    //this.ApplyParentChildRel();
  }

  /** Apply the advancedTerms on the items */
  advancedFilter(): any[] {
    // Terms are invalid, return every item
    if (this.searchTerm.advancedTerms.every(t => t.action === undefined)) { return this.inputArray; }

    // Apply filters
    return this.inputArray.filter(item => {
      if (this.searchTerm.advancedSearchLink === 'and') {
        // AND mode, every rule needs to pass for an item
        return this.searchTerm.advancedTerms.every(term => this.advancedTermPassed(item, term));
      } else {
        // OR mode, at least one rule needs to pass for an item
        return this.searchTerm.advancedTerms.some(term => this.advancedTermPassed(item, term));
      }
    });
  }

  /** Test an advanced rule on an item */
  advancedTermPassed(item: any, term: NgAsAdvancedSearchTerm): boolean {
    if (term.action === undefined) { return true; }

    let rerturnVal: boolean = false;;

    let evalValue: any = '';
    if (term.fieldName === 'shortTitle') {
      evalValue = item[term.fieldName!].map((x: any) => x.abbr.toLowerCase());
    }
    else if (term.fieldName === 'firstName') {
      evalValue = item['creators'].map((x: any) => x.firstName.toLowerCase());
    }
    else if (term.fieldName === 'lastName') {
      evalValue = item['creators'].map((x: any) => x.lastName.toLowerCase());
    }
    else if (term.fieldName === 'title') {
      evalValue = [];
      if (item['altTitle'].length > 0)
        evalValue = item['altTitle'].map((x: any) => x.toLowerCase());

      evalValue.push(String(item[term.fieldName!]).toLowerCase());
    }
    else {
      evalValue = String(item[term.fieldName!]).toLowerCase();
    }
    const termValue = String(term.searchTerm).toLowerCase();

    // Test value based on selected criteria
    switch (term.action) {
      case 'contains':
        if (term.fieldName === 'shortTitle' || term.fieldName === 'firstName' || term.fieldName === 'lastName' || term.fieldName === 'title') {
          rerturnVal = evalValue.filter((x: any) => x.includes(termValue)).length > 0
        }
        else {
          rerturnVal = evalValue.includes(termValue);
        }
        break;

      case 'equals':
        if (term.fieldName === 'shortTitle' || term.fieldName === 'firstName' || term.fieldName === 'lastName' || term.fieldName === 'title') {
          rerturnVal = evalValue.filter((x: any) => x === termValue).length > 0
        }
        else {
          rerturnVal = (evalValue === termValue);
        }
        break;

      case 'larger than':
        rerturnVal = (evalValue > termValue);
        break;

      case 'smaller than':
        rerturnVal = (evalValue < termValue);
        break;

      default: break;
    }

    return term.isNegated ? !rerturnVal : rerturnVal;
  };

  // ***********************************************************************************************************
  // Search term configuration
  // ***********************************************************************************************************

  /** Toggle the link between advanced terms (AND/OR) */
  toggleAdvancedLink() {
    if (this.searchTerm.advancedSearchLink === 'and') {
      this.searchTerm.advancedSearchLink = 'or';
    } else {
      this.searchTerm.advancedSearchLink = 'and';
    }

    this.outputUpdate();
  }

  /** Negate an advanced search term */
  termNegate(term: NgAsAdvancedSearchTerm) {
    term.isNegated = !term.isNegated;

    this.outputUpdate();
  }

  /** Add a new advanced search term */
  addTermRow() {
    this.searchTerm.advancedTerms.push({ id: this.advancedTermCounter });
    this.advancedTermCounter++;

    this.outputUpdate();
  }

  /** Delete an advance search term */
  delTermRow(termId: any) {
    this.searchTerm.advancedTerms = this.searchTerm.advancedTerms.filter(t => t.id !== termId);
    if (this.searchTerm.advancedTerms.length === 0) {
      this.searchTerm.advancedTerms.push({ id: 0 });
    }

    this.outputUpdate();
  }

  /** An advanced search terms column was changed */
  updateTermField(term: NgAsAdvancedSearchTerm) {
    // Populate term type based on header type
    const header: any = this.headers.find(h => h.id === term.fieldName);

    if (header.type !== undefined) {
      term.fieldType = header.type;
    }

    this.outputUpdate();
  }

  // ***********************************************************************************************************
  // Filter saving
  // ***********************************************************************************************************

  loadedFilterName: string = '';
  loadedFilter!: NgAsSearchTerm;

  public get loadedFilterChanged(): boolean {
    if (this.loadedFilter !== undefined)
      return !this.areTermsEqual(this.loadedFilter, this.searchTerm);
    return false;
  }

  termLoaded(name: string) {
    this.loadedFilterName = name;
    this.loadedFilter = this.savedFilters.find(f => f.name === this.loadedFilterName) as NgAsSearchTerm;
    this.searchTerm = {
      simpleSearchTerm: this.loadedFilter.simpleSearchTerm,
      searchMode: this.loadedFilter.searchMode,
      advancedSearchLink: this.loadedFilter.advancedSearchLink,
      advancedTerms: this.loadedFilter.advancedTerms.map(t => ({
        id: t.id,
        fieldName: t.fieldName,
        isNegated: t.isNegated,
        action: t.action,
        searchTerm: t.searchTerm
      } as NgAsAdvancedSearchTerm))
    } as NgAsSearchTerm;

    this.outputUpdate();
  }

  areTermsEqual(a: NgAsSearchTerm, b: NgAsSearchTerm): boolean {
    if (a === null && b !== null) { return false; }
    if (a !== null && b === null) { return false; }
    if (a === null && b === null) { return true; }

    if (a.simpleSearchTerm !== b.simpleSearchTerm) { return false; }
    if (a.searchMode !== b.searchMode) { return false; }
    if (a.advancedSearchLink !== b.advancedSearchLink) { return false; }
    if (a.advancedTerms.length !== b.advancedTerms.length) { return false; }
    return a.advancedTerms.every((termA, index) => {
      const termB = b.advancedTerms[index];
      if (termA.id !== termB.id) { return false; }
      if (termA.fieldName !== termB.fieldName) { return false; }
      if (termA.isNegated !== termB.isNegated) { return false; }
      if (termA.action !== termB.action) { return false; }
      if (termA.searchTerm !== termB.searchTerm) { return false; }
      return true;
    });
  }

  async getAllBiblioData() {
    // this.data = await this.syncService.sync(false, null);
    // if (this.data !== null) {
    //   if (typeof this.data === 'string') {
    //     this.showToast(this.data, 'bg-danger');
    this.data = await this.syncService.getPreviousVersion()
    // }
    this.biblAPI.getAllAlternateTitle().subscribe(resp => {
      this.allAltTitles = resp;
      this.convertJSONToArray(this.data.items);
      this.ApplyAdvanceSearch();
      this.ApplyParentChildRel();
      this.sortByCol('title', null!);
      this.loading = false;
    });
    // }
  }

  convertJSONToArray(data: any) {
    for (let d of data) {
      let zoteroItem: ZoteroItem = new ZoteroItem(d);
      if (d.itemType !== 'note') {
        if (this.allAltTitles.filter((x: any) => x.callNumber === zoteroItem.callNumber).length > 0) {
          zoteroItem.altTitle = this.allAltTitles.filter((x: any) => x.callNumber === zoteroItem.callNumber).map((x: any) => x.title);
        }
        this.allBiblioData.push(zoteroItem)
      }
    }
  }

  ApplyParentChildRel() {
    let interval = setInterval(() => {
      //let data: Array<ZoteroItem> = new Array();
      if (this.filteredData.length > 0) {
        this.allBiblioData = this.filteredData.map((a: any) => Object.assign(new ZoteroItem(a), a));

        for (let item of this.parentChildRelations) {
          let childIndex = this.filteredData.findIndex((x: any) => x.callNumber === item.child_callNumber);
          let parentIndex = this.filteredData.findIndex((x: any) => x.callNumber === item.parent_callNumber);
          if (childIndex > -1) {
            this.filteredData[parentIndex].children.push(this.filteredData[childIndex]);
            this.filteredData[childIndex].category = item.cat_name;
            //this.biblioData.splice(childIndex, 1);
          }
        }

        for (let item of this.parentChildRelations) {
          this.filteredData = this.filteredData.filter((x: any) => x.callNumber !== item.child_callNumber);
        }

        clearInterval(interval);
      }
    }, 500)
  }

  getSpecificData(obj: ZoteroItem, event: Event) {
    console.log(obj)
    this.removeHiglightedClass(event.currentTarget as HTMLElement);
    this.biblioItemMore.getSpecificData(obj);
    this.currentSelectedRecord = obj;
    document.getElementById('btnOpenModalDetail')?.click();
  }

  async getAllBiblioCitationsStyle() {
    this.citations = await this.syncService.getAllBiblioCitationStyles();
  }

  removeHiglightedClass(element: HTMLElement) {
    let classes = document.getElementsByClassName('highlighted')
    if (classes.length > 0) {
      Array.from(classes).forEach((element: any) => {
        element.classList.remove('highlighted');
      });
    }
    element.classList.add('highlighted');
  }

  expandChild(data: any, flag: boolean) {
    data.showChild = flag;
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

  expandInnerChild(data: any, flag: boolean, event: any) {
    let viewContainerRef = this.childView.filter(x => x.element.nativeElement.isEqualNode(event.currentTarget.parentNode.parentNode))[0];
    data.showChild = flag;
    if (flag) {
      const componentRef = viewContainerRef.createComponent(ChildListComponent);
      componentRef.instance.data = data;
      componentRef.instance.biblioItemInfoComp = this.biblioItemMore;
      componentRef.instance.parentComponent = this;
    }
    else {
      viewContainerRef.clear();
    }
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
      this.filteredData = this.filteredData.sort(function (a: any, b: any) {
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
      this.filteredData = this.filteredData.sort(function (a: any, b: any) {
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
    }, 5000);
  }
}
