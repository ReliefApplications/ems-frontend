import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafeChartSettingsComponent } from './chart-settings.component';

describe('SafeChartSettingsComponent', () => {
  let component: SafeChartSettingsComponent;
  let fixture: ComponentFixture<SafeChartSettingsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SafeChartSettingsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeChartSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
