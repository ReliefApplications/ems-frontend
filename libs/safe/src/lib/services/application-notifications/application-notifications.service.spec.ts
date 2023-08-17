import { TestBed } from '@angular/core/testing';
import { SafeApplicationNotificationsService } from './application-notifications.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { AppAbility } from '../auth/auth.service';

describe('SafeApplicationNotificationsService', () => {
  let service: SafeApplicationNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(SafeApplicationNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
