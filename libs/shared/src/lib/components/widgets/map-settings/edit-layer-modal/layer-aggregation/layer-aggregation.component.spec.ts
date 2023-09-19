import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerAggregationComponent } from './layer-aggregation.component';

describe('LayerAggregationComponent', () => {
  let component: LayerAggregationComponent;
  let fixture: ComponentFixture<LayerAggregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerAggregationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
