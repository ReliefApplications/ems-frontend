import { TestBed } from '@angular/core/testing';

import { SafeLayoutService } from './layout.service';

describe('SafeLayoutService', () => {
  let service: SafeLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
