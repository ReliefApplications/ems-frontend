import { TestBed } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { AppAbility } from '../auth/auth.service';

describe('AuthInterceptorService', () => {
  let service: AuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: 'environment',
          useValue: { availableLanguages: ['en', 'fr', 'uk'] },
        },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(AuthInterceptorService);
  });

  afterEach(() => {
    localStorage.removeItem('lang');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds the selected language header', () => {
    localStorage.setItem('lang', 'uk');
    const request = new HttpRequest('GET', '/api/test');
    const serviceWithPrivateMethod = service as unknown as {
      addLanguageToRequest(request: HttpRequest<unknown>): HttpRequest<unknown>;
    };

    const result = serviceWithPrivateMethod.addLanguageToRequest(request);

    expect(result.headers.get('Language')).toBe('uk');
  });
});
