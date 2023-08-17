import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeStepComponent } from './step.component';

describe('SafeStepComponent', () => {
  let component: SafeStepComponent;
  let fixture: ComponentFixture<SafeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeStepComponent);
    component = fixture.componentInstance;
    component.step = { type: undefined };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
