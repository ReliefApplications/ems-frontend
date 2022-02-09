import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGridSettingsComponent } from './grid-settings.component';

describe('SafeGridSettingsComponent', () => {
  let component: SafeGridSettingsComponent;
  let fixture: ComponentFixture<SafeGridSettingsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SafeGridSettingsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
