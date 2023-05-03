import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioItemCompareComponent } from './biblio-item-compare.component';

describe('BiblioItemCompareComponent', () => {
  let component: BiblioItemCompareComponent;
  let fixture: ComponentFixture<BiblioItemCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioItemCompareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiblioItemCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
