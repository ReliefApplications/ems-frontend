import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAggregationBuilderComponent } from './aggregation-builder.component';

describe('SafeAggregationBuilderComponent', () => {
  let component: SafeAggregationBuilderComponent;
  let fixture: ComponentFixture<SafeAggregationBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAggregationBuilderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAggregationBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
