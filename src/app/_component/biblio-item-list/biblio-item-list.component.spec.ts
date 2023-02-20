import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioItemListComponent } from './biblio-item-list.component';

describe('BiblioItemListComponent', () => {
  let component: BiblioItemListComponent;
  let fixture: ComponentFixture<BiblioItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioItemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiblioItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
