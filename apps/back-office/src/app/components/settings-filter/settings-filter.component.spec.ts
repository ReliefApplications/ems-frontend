import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFilterComponent } from './settings-filter.component';

describe('SettingsFilterComponent', () => {
  let component: SettingsFilterComponent;
  let fixture: ComponentFixture<SettingsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
