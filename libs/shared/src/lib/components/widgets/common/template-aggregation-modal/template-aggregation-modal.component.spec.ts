import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAggregationModalComponent } from './template-aggregation-modal.component';

describe('TemplateAggregationModalComponent', () => {
  let component: TemplateAggregationModalComponent;
  let fixture: ComponentFixture<TemplateAggregationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateAggregationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateAggregationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
