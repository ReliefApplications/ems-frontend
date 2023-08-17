import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility, SafeAuthService } from './auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeAuthService', () => {
  let service: SafeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      imports: [HttpClientModule, ApolloTestingModule, OAuthModule.forRoot()],
    });

    service = TestBed.inject(SafeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
