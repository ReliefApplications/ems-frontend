import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTriggerModalComponent } from './manage-trigger-modal.component';

describe('ManageTriggerModalComponent', () => {
  let component: ManageTriggerModalComponent;
  let fixture: ComponentFixture<ManageTriggerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageTriggerModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTriggerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
