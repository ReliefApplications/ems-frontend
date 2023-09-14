import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SafePermissionGuard } from './permission.guard';
import { AppAbility } from '../services/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('SafePermissionGuard', () => {
  let guard: SafePermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      imports: [
        OAuthModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
      ],
    });
    guard = TestBed.inject(SafePermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
