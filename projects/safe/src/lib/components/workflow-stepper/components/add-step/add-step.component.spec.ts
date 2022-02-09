import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAddStepComponent } from './add-step.component';

describe('SafeAddStepComponent', () => {
  let component: SafeAddStepComponent;
  let fixture: ComponentFixture<SafeAddStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
