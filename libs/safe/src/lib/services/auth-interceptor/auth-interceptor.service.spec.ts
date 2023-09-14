import { TestBed } from '@angular/core/testing';
import { SafeAuthInterceptorService } from './auth-interceptor.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppAbility } from '../auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('AuthInterceptorService', () => {
  let service: SafeAuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      imports: [ApolloTestingModule, HttpClientModule, OAuthModule.forRoot()],
    });
    service = TestBed.inject(SafeAuthInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
