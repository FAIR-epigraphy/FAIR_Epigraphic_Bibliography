import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ZoteroSyncService } from 'src/app/_service/zotero-sync.service';

declare var bootstrap: any; // Declare Bootstrap as a global variable

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent{
  @Input() loginUser = null;
  @Input() showSearchBar = false;
  @Input() mainSearchBar: string = '';
  @Output() searchValueChange = new EventEmitter();

  constructor(private zoteroAPI: ZoteroSyncService) { }
  
  changeText()
  {
    this.searchValueChange.emit(this.mainSearchBar);
  }
  takeBackup() {
    this.zoteroAPI.takeBackup();
  }

  sync() {
    //window.location.reload();
    let modalEle = document.getElementById('confirmModal')
    const modal = new bootstrap.Modal(modalEle);
    modal.show(); // Show the modal when it's fully initialized.
  }
}
