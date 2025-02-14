import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTemplateModalComponent } from './manage-templates-modal.component';

describe('ManageTemplateModalComponent', () => {
  let component: ManageTemplateModalComponent;
  let fixture: ComponentFixture<ManageTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
