import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabsWidgetSettingsComponent } from './tabs-widget-settings.component';

describe('SafeTabsWidgetSettingsComponent', () => {
  let component: SafeTabsWidgetSettingsComponent;
  let fixture: ComponentFixture<SafeTabsWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeTabsWidgetSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeTabsWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
