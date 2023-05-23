import { TestBed } from '@angular/core/testing';

import { SafeGridLayoutService } from './grid-layout.service';

describe('SafeGridLayoutService', () => {
  let service: SafeGridLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeGridLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
