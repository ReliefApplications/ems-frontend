import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationGridComponent } from './aggregation-grid.component';

describe('AggregationGridComponent', () => {
  let component: AggregationGridComponent;
  let fixture: ComponentFixture<AggregationGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationGridComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
