import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';

import { SafePermissionGuard } from './permission.guard';

describe('SafePermissionGuard', () => {
  let guard: SafePermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
      ],
      imports: [HttpClientModule, RouterTestingModule],
    });
    guard = TestBed.inject(SafePermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
