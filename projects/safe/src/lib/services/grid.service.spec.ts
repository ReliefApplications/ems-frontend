import { TestBed } from '@angular/core/testing';

import { SafeGridService } from './grid.service';

describe('SafeGridService', () => {
  let service: SafeGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
