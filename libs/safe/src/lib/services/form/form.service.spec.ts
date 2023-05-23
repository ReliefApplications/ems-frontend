import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'projects/back-office/src/environments/environment';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { UntypedFormBuilder } from '@angular/forms';

import { SafeFormService } from './form.service';

describe('SafeFormService', () => {
  let service: SafeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: environment },
        UntypedFormBuilder,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
      ],
      imports: [HttpClientModule, DialogCdkModule],
    });
    service = TestBed.inject(SafeFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
