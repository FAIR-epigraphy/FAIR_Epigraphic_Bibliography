import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBiblioItemCategoryComponent } from './manage-biblio-item-category.component';

describe('ManageBiblioItemCategoryComponent', () => {
  let component: ManageBiblioItemCategoryComponent;
  let fixture: ComponentFixture<ManageBiblioItemCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBiblioItemCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBiblioItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
