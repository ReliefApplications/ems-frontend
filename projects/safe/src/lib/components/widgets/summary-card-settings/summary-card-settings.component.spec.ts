import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';

describe('SafeSummaryCardSettingsComponent', () => {
  let component: SafeSummaryCardSettingsComponent;
  let fixture: ComponentFixture<SafeSummaryCardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSummaryCardSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSummaryCardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
