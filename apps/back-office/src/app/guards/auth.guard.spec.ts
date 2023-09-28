import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from '@oort-front/shared';
import { MockedRouter, MockedAuthService } from '../__mocks__/mock-class.test';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router!: Router;
  let authService!: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: MockedAuthService },
        { provide: Router, useClass: MockedRouter },
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    guard = new AuthGuard(authService, router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
