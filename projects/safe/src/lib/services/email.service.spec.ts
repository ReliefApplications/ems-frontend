import { TestBed } from '@angular/core/testing';

import { SafeEmailService } from './email.service';

describe('SafeEmailService', () => {
  let service: SafeEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
