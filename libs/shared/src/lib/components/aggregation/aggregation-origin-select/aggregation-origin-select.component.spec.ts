import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationOriginSelectComponent } from './aggregation-origin-select.component';

describe('AggregationOriginSelectComponent', () => {
  let component: AggregationOriginSelectComponent;
  let fixture: ComponentFixture<AggregationOriginSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregationOriginSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AggregationOriginSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
