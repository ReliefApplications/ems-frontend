import { TestBed } from '@angular/core/testing';

import { SafeApplicationService } from './application.service';

describe('SafeApplicationService', () => {
  let service: SafeApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
