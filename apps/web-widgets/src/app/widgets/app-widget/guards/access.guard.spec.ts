import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';

import { ApolloTestingModule } from 'apollo-angular/testing';
import { Ability } from '@casl/ability';

import { AccessGuard } from './access.guard';
import { environment } from '../../environments/environment';

describe('AccessGuard', () => {
  let guard: AccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        OAuthModule.forRoot(),
        ApolloTestingModule,
      ],
      providers: [
        Ability,
        {
          provide: 'environment',
          useValue: environment,
        },
      ],
    });
    guard = TestBed.inject(AccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
