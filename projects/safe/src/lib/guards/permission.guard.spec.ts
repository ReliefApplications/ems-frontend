import { TestBed } from '@angular/core/testing';

import { SafePermissionGuard } from './permission.guard';

describe('SafePermissionGuard', () => {
  let guard: SafePermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SafePermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
