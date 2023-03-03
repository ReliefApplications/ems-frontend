import { TestBed } from '@angular/core/testing';

import { SafeRestService } from './rest.service';

describe('RestService', () => {
  let service: SafeRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
