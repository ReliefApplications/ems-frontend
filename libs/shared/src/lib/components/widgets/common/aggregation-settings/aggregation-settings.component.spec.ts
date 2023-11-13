import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationSettingsComponent } from './aggregation-settings.component';

describe('AggregationSettingsComponent', () => {
  let component: AggregationSettingsComponent;
  let fixture: ComponentFixture<AggregationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AggregationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
