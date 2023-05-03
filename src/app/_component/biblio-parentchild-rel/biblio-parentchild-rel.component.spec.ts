import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioParentchildRelComponent } from './biblio-parentchild-rel.component';

describe('BiblioParentchildRelComponent', () => {
  let component: BiblioParentchildRelComponent;
  let fixture: ComponentFixture<BiblioParentchildRelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioParentchildRelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiblioParentchildRelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
