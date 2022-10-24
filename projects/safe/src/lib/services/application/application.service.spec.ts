import { TestBed } from '@angular/core/testing';
import { environment } from 'projects/back-office/src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SafeApplicationService } from './application.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SafeApplicationService', () => {
  let service: SafeApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: environment },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
      ],
      imports: [HttpClientModule, MatSnackBarModule, RouterTestingModule],
    });
    service = TestBed.inject(SafeApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
