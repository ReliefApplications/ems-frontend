import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerAggregationComponent } from './layer-aggregation.component';

describe('SafeLayerAggregationComponent', () => {
  let component: SafeLayerAggregationComponent;
  let fixture: ComponentFixture<SafeLayerAggregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayerAggregationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
