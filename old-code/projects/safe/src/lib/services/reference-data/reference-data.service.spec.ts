import { TestBed } from '@angular/core/testing';

import { SafeReferenceDataService } from './reference-data.service';

describe('SafeReferenceDataService', () => {
  let service: SafeReferenceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeReferenceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
