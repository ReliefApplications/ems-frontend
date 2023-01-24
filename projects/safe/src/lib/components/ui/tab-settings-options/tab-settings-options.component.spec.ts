import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabSettingsOptionsComponent } from './tab-settings-options.component';

describe('SettingsOptionsComponent', () => {
  let component: SafeTabSettingsOptionsComponent<any>;
  let fixture: ComponentFixture<SafeTabSettingsOptionsComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTabSettingsOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabSettingsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
