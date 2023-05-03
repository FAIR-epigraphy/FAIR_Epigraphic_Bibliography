import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioAdvanceSearchComponent } from './biblio-advance-search.component';

describe('BiblioAdvanceSearchComponent', () => {
  let component: BiblioAdvanceSearchComponent;
  let fixture: ComponentFixture<BiblioAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioAdvanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiblioAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
