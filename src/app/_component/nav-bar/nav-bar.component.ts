import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ZoteroSyncService } from 'src/app/_service/zotero-sync.service';

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
    window.location.reload();
  }
}
