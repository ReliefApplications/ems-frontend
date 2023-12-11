import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { WorkflowService } from './workflow.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { AppAbility } from '../auth/auth.service';

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
        AppAbility,
      ],
      imports: [
        HttpClientModule,
        ApolloTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(WorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
