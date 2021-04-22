import { TestBed } from '@angular/core/testing';

import { AggregationBuilderService } from './aggregation-builder.service';

describe('AggregationBuilderService', () => {
  let service: AggregationBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AggregationBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
