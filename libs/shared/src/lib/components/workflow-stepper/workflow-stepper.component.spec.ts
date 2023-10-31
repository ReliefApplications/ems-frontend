import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowStepperComponent } from './workflow-stepper.component';

describe('WorkflowStepperComponent', () => {
  let component: WorkflowStepperComponent;
  let fixture: ComponentFixture<WorkflowStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowStepperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
