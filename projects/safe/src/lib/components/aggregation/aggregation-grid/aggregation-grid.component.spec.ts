import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAggregationGridComponent } from './aggregation-grid.component';

describe('SafeAggregationGridComponent', () => {
  let component: SafeAggregationGridComponent;
  let fixture: ComponentFixture<SafeAggregationGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAggregationGridComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAggregationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
