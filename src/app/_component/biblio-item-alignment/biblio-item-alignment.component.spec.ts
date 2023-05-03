import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioItemAlignmentComponent } from './biblio-item-alignment.component';

describe('BiblioItemAlignmentComponent', () => {
  let component: BiblioItemAlignmentComponent;
  let fixture: ComponentFixture<BiblioItemAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioItemAlignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiblioItemAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
