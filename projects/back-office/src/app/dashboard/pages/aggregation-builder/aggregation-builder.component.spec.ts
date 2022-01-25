import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationBuilderComponent } from './aggregation-builder.component';

describe('AggregationBuilderComponent', () => {
  let component: AggregationBuilderComponent;
  let fixture: ComponentFixture<AggregationBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationBuilderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
