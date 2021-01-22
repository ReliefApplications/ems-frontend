import { TestBed } from '@angular/core/testing';

import { WhoPermissionGuard } from './permission.guard';

describe('WhoPermissionGuard', () => {
  let guard: WhoPermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WhoPermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
