import { TestBed } from '@angular/core/testing';

import { BiblioGuard } from './biblio.guard';

describe('BiblioGuard', () => {
  let guard: BiblioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BiblioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
