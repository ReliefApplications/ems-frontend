import { TestBed } from '@angular/core/testing';

import { SafeApiProxyService } from './api-proxy.service';

describe('SafeApiProxyService', () => {
  let service: SafeApiProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeApiProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
