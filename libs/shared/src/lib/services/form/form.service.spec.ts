import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { UntypedFormBuilder } from '@angular/forms';

import { FormService } from './form.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../auth/auth.service';

describe('FormService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        UntypedFormBuilder,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      imports: [HttpClientModule, DialogCdkModule, ApolloTestingModule],
    });
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
