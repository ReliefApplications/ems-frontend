import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFloatingButtonSettingsComponent } from './floating-button-settings.component';

describe('SafeFloatingButtonSettingsComponent', () => {
  let component: SafeFloatingButtonSettingsComponent;
  let fixture: ComponentFixture<SafeFloatingButtonSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeFloatingButtonSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFloatingButtonSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
