import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioItemMoreInfoComponent } from './biblio-item-more-info.component';

describe('BiblioItemMoreInfoComponent', () => {
  let component: BiblioItemMoreInfoComponent;
  let fixture: ComponentFixture<BiblioItemMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioItemMoreInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiblioItemMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
