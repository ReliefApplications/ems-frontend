import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { DividerModule } from '@oort-front/ui';

describe('SafeWorkflowStepperComponent', () => {
  let component: SafeWorkflowStepperComponent;
  let fixture: ComponentFixture<SafeWorkflowStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeWorkflowStepperComponent],
      imports: [DividerModule],
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
