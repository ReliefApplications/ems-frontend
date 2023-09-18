import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility, AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      imports: [HttpClientModule, ApolloTestingModule],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
