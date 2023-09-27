import { TestBed } from '@angular/core/testing';
import { AggregationService } from './aggregation.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('AggregationService', () => {
  let service: AggregationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(AggregationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
