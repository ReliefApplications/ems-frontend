import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAggregationsComponent } from './template-aggregations.component';

describe('TemplateAggregationsComponent', () => {
  let component: TemplateAggregationsComponent;
  let fixture: ComponentFixture<TemplateAggregationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateAggregationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateAggregationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
