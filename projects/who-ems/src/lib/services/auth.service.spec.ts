import { TestBed } from '@angular/core/testing';

import { WhoAuthService } from './auth.service';

describe('WhoAuthService', () => {
  let service: WhoAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhoAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
