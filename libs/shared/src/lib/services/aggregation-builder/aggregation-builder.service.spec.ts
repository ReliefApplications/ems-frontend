import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { AggregationBuilderService } from './aggregation-builder.service';

describe('AggregationBuilderService', () => {
  let service: AggregationBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, { provide: 'environment', useValue: {} }],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AggregationBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
