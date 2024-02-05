import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AieglAbbreviationComponent } from './aiegl-abbreviation.component';

describe('AieglAbbreviationComponent', () => {
  let component: AieglAbbreviationComponent;
  let fixture: ComponentFixture<AieglAbbreviationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AieglAbbreviationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AieglAbbreviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
