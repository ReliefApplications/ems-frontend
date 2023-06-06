import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFilteringSettingsComponent } from './filtering-settings.component';

describe('SafeFilteringSettingsComponent', () => {
  let component: SafeFilteringSettingsComponent;
  let fixture: ComponentFixture<SafeFilteringSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFilteringSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeFilteringSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
