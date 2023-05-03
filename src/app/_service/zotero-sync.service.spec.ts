import { TestBed } from '@angular/core/testing';

import { ZoteroSyncService } from './zotero-sync.service';

describe('ZoteroSyncService', () => {
  let service: ZoteroSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoteroSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
