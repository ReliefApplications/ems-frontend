import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeWorkflowStepperComponent } from './workflow-stepper.component';

describe('SafeWorkflowStepperComponent', () => {
  let component: SafeWorkflowStepperComponent;
  let fixture: ComponentFixture<SafeWorkflowStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeWorkflowStepperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeWorkflowStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
