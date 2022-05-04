import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMapSettingsComponent } from './map-settings.component';

describe('SafeMapSettingsComponent', () => {
  let component: SafeMapSettingsComponent;
  let fixture: ComponentFixture<SafeMapSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SafeMapSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
