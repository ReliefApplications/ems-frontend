import { TestBed } from '@angular/core/testing';
import { SafeAuthInterceptorService } from './auth-interceptor.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { AppAbility } from '../auth/auth.service';

describe('AuthInterceptorService', () => {
  let service: SafeAuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(SafeAuthInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
