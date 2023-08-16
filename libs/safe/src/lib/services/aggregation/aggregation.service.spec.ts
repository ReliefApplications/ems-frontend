import { TestBed } from '@angular/core/testing';
import { SafeAggregationService } from './aggregation.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('AggregationService', () => {
  let service: SafeAggregationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(SafeAggregationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
