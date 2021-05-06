import { TestBed } from '@angular/core/testing';

import { SafeAuthService } from './auth.service';

describe('SafeAuthService', () => {
  let service: SafeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
