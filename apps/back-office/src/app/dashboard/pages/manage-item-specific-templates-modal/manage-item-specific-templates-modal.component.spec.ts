import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageItemSpecificTemplatesModalComponent } from './manage-item-specific-templates-modal.component';

describe('ManageItemSpecificTemplatesModalComponent', () => {
  let component: ManageItemSpecificTemplatesModalComponent;
  let fixture: ComponentFixture<ManageItemSpecificTemplatesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageItemSpecificTemplatesModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ManageItemSpecificTemplatesModalComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
