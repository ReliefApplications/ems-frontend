import { TestBed } from '@angular/core/testing';
import { DataTemplateService } from './data-template.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { AppAbility } from '../auth/auth.service';

describe('DataTemplateService', () => {
  let service: DataTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslateService,
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        HttpClientModule,
        ApolloTestingModule,
      ],
    });
    service = TestBed.inject(DataTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
