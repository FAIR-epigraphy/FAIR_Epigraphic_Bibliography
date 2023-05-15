import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbbreviationListComponent } from './abbreviation-list.component';

describe('AbbreviationListComponent', () => {
  let component: AbbreviationListComponent;
  let fixture: ComponentFixture<AbbreviationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbbreviationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbbreviationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
