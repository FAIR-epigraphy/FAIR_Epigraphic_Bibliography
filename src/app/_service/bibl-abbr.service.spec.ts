import { TestBed } from '@angular/core/testing';

import { BiblAbbrService } from './bibl-abbr.service';

describe('BiblAbbrService', () => {
  let service: BiblAbbrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiblAbbrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
