import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_service/auth.service';
import { AppComponent } from 'src/app/app.component';
import { ZoteroSyncService } from '../../_service/zotero-sync.service';
import { BiblApiService } from '../../_service/bibl-api.service';
import { ZoteroItem } from 'src/app/_models/zotero-item.model';

declare var bootstrap: any; // Declare Bootstrap as a global variable

@Component({
  selector: 'app-duplicate-callno',
  templateUrl: './duplicate-callno.component.html',
  styleUrls: ['./duplicate-callno.component.scss']
})

export class DuplicateCallnoComponent implements OnInit {
  loginUser = null;
  canActive: boolean = false;
  data: any = [];
  totalItems = 0;
  loading = false;
  allAltTitles: any = [];
  allBiblioData: Array<ZoteroItem> = new Array();

  constructor(
    // private router: Router,
    private authService: AuthService,
    private syncService: ZoteroSyncService,
    private apiService: BiblApiService,
    private appComponent: AppComponent
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticate()) {
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
      this.canActive = true;
    }
    else
      this.loginUser = null;

    this.getAllBiblioData()
  }

  async getAllBiblioData() {
    this.showProgress();
    this.data = await this.syncService.sync(false, this.appComponent);
    this.hideProgress();
    if (this.data !== null) {
      if (typeof this.data === 'string') {
        this.showToast(this.data, 'bg-danger');
        this.data = await this.syncService.getPreviousVersion()
      }
      this.apiService.getAllAlternateTitle().subscribe(resp => {
        this.totalItems = this.data.items.length;
        this.convertJSONToArray(this.data.items);
        //this.getAllAbbr()
        this.findDuplicates()
        this.loading = false;
      });
    }
  }

  convertJSONToArray(data: any) {
    for (let d of data) {
      let zoteroItem: ZoteroItem = new ZoteroItem(d);
      if (d.itemType !== 'note') {
        if (this.allAltTitles.filter((x: any) => x.callNumber === zoteroItem.callNumber).length > 0) {
          zoteroItem.altTitle = this.allAltTitles.filter((x: any) => x.callNumber === zoteroItem.callNumber).map((x: any) => x.title);
        }
        this.allBiblioData.push(zoteroItem);
      }
    }
  }

  showProgress() {
    let modalEle = document.getElementById('loadingModal')
    const modal = new bootstrap.Modal(modalEle);
    modal.show(); // Show the modal when it's fully initialized.
  }

  hideProgress() {
    document.getElementById('btnHideModal')?.click();
  }

  findDuplicates() {
    let map: any = {};
    let duplicates: any = [];
    let zoteroKeys: any = []

    // Iterate through the array
    this.allBiblioData.forEach((item: ZoteroItem) => {
      // Get the value of the specified attribute
      let value = item.callNumber;

      // If the value is already in the map, it's a duplicate
      // if (map[value]) {
      //   let previousItem = this.allBiblioData.find((x: ZoteroItem) => zoteroKeys.includes(x.key) === true)
      //   duplicates.push(previousItem);
      //   duplicates.push(item);
      // } else {
      //   // Add the value to the map
      //   map[value] = true;
      //   zoteroKeys.push(item.key)
      // }

      if (map[value]) {
        duplicates[map[value]].push(item);
      } else {
        // Add the value to the map
        map[value] = duplicates.length;
        duplicates.push([item]);
      }
    });

    console.log(duplicates);
    //return duplicates;

    let duplicateEntities = duplicates.filter((dupGroup: any) => dupGroup.length > 1);

    let duplicateEntriesList = document.getElementById('duplicateEntries') as HTMLElement;
    duplicateEntities.forEach((dupGroup: any) => {
      let listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      let groupText = '';
      dupGroup.forEach((item:ZoteroItem) => {
        groupText += `${item.callNumber}: ${item.title}, ${item.getCreators()}, ${item.date} <br>`;
      });
      listItem.innerHTML = groupText;
      duplicateEntriesList.appendChild(listItem);
    });
  }

  showToast(msg: any, color: any) {
    const toastElement = document.getElementById('divErrorHome');
    document.getElementById('divErrorHome')?.classList.remove('text-bg-danger')
    document.getElementById('divErrorHome')?.classList.remove('text-bg-success')
    document.getElementById('divErrorHome')?.classList.add(color);
    (document.getElementById('divMsg') as HTMLElement).innerHTML = msg;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }

}
