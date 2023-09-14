import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SafeApplicationService } from './application.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeApplicationService', () => {
  let service: SafeApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      imports: [
        OAuthModule.forRoot(),
        HttpClientModule,
        ApolloTestingModule,
        TranslateModule.forRoot(),
      ],
    });
    service = TestBed.inject(SafeApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
