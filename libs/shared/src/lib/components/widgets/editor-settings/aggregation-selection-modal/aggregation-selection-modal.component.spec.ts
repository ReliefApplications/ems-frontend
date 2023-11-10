import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationSelectionModalComponent } from './aggregation-selection-modal.component';

describe('AggregationSelectionModalComponent', () => {
  let component: AggregationSelectionModalComponent;
  let fixture: ComponentFixture<AggregationSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AggregationSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
