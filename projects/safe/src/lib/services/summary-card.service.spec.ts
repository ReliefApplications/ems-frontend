import { TestBed } from '@angular/core/testing';

import { SummaryCardService } from './summary-card.service';

describe('SummaryCardService', () => {
  let service: SummaryCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
