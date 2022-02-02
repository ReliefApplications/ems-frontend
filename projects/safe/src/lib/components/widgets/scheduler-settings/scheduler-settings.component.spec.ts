import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafeSchedulerSettingsComponent } from './scheduler-settings.component';

describe('SafeSchedulerSettingsComponent', () => {
  let component: SafeSchedulerSettingsComponent;
  let fixture: ComponentFixture<SafeSchedulerSettingsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SafeSchedulerSettingsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSchedulerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
