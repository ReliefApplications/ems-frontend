import { TestBed } from '@angular/core/testing';
import { SafeApplicationNotificationsService } from './application-notifications.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeApplicationNotificationsService', () => {
  let service: SafeApplicationNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      imports: [
        OAuthModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
      ],
    });
    service = TestBed.inject(SafeApplicationNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
