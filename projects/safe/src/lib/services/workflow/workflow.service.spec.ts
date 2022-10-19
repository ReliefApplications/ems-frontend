import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'projects/back-office/src/environments/environment';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';

import { SafeWorkflowService } from './workflow.service';

describe('SafeWorkflowService', () => {
  let service: SafeWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: environment },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
      ],
      imports: [MatSnackBarModule, RouterTestingModule, HttpClientModule],
    });
    service = TestBed.inject(SafeWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
