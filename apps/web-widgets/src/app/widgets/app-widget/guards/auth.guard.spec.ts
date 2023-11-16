import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuthGuard } from './auth.guard';
import { Ability } from '@casl/ability';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        OAuthModule.forRoot(),
        ApolloTestingModule,
      ],
      providers: [
        Ability,
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
