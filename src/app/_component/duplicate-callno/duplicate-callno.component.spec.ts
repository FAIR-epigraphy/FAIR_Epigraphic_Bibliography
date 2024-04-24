import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateCallnoComponent } from './duplicate-callno.component';

describe('DuplicateCallnoComponent', () => {
  let component: DuplicateCallnoComponent;
  let fixture: ComponentFixture<DuplicateCallnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DuplicateCallnoComponent]
    });
    fixture = TestBed.createComponent(DuplicateCallnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
