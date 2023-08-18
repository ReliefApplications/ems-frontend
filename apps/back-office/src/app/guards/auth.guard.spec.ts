import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { SafeAuthService } from '@oort-front/safe';
import { MockedRouter, MockedSafeAuthService } from '../__mocks__/mock-class.test';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router!: Router;
  let authService!: SafeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SafeAuthService, useClass: MockedSafeAuthService },
        { provide: Router, useClass: MockedRouter },
      ],
    });
    authService = TestBed.inject(SafeAuthService);
    router = TestBed.inject(Router);
    guard = new AuthGuard(authService, router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
