import { TestBed } from '@angular/core/testing';

import { BiblApiService } from './bibl-api.service';

describe('BiblApiService', () => {
  let service: BiblApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiblApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
