import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeAddStepComponent } from './add-step.component';
import { setupSpecConfig } from '../../../ui/aggregation-builder/pipeline/shared-config/spec/config';

describe('SafeAddStepComponent', () => {
  let component: SafeAddStepComponent;
  let fixture: ComponentFixture<SafeAddStepComponent>;

  beforeEach(async () => setupSpecConfig(SafeAddStepComponent));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
