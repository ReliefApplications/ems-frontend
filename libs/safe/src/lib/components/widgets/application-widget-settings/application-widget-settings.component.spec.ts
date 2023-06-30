import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeApplicationWidgetSettingsComponent } from './application-widget-settings.component';

describe('SafeApplicationWidgetSettingsComponent', () => {
  let component: SafeApplicationWidgetSettingsComponent;
  let fixture: ComponentFixture<SafeApplicationWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeApplicationWidgetSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeApplicationWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
