import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { environment } from 'projects/back-office/src/environments/environment';

import { AggregationBuilderService } from './aggregation-builder.service';

describe('AggregationBuilderService', () => {
  let service: AggregationBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: 'environment', useValue: environment },
      ],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AggregationBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
