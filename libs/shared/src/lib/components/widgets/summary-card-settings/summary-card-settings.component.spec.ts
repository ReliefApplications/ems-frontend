import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCardSettingsComponent } from './summary-card-settings.component';

describe('SummaryCardSettingsComponent', () => {
  let component: SummaryCardSettingsComponent;
  let fixture: ComponentFixture<SummaryCardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryCardSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryCardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
