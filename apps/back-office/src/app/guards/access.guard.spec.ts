import { TestBed } from '@angular/core/testing';

import { AccessGuard } from './access.guard';
import { SafeAuthService } from '@oort-front/safe';
import { SnackbarService } from '@oort-front/ui';
import { Router } from '@angular/router';
import {
  // TranslateFakeLoader,
  // TranslateLoader,
  // TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
// import { RouterTestingModule } from '@angular/router/testing';
import {
  MockedRouter,
  MockedSafeAuthService,
  MockedSnackbarService,
  MockedTranslateService,
} from '../__mocks__/mock-class.test';

describe('AccessGuard', () => {
  let guard: AccessGuard;
  let router!: Router;
  let authService!: SafeAuthService;
  let snackbarService!: SnackbarService;
  let translateService!: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [
      //   // For future deep tests
      //   RouterTestingModule.withRoutes([
      //     { path: 'auth', component: TestingComponent },
      //   ]),
      // ],
      providers: [
        { provide: SafeAuthService, useClass: MockedSafeAuthService },
        { provide: SnackbarService, useClass: MockedSnackbarService },
        { provide: Router, useClass: MockedRouter },
        { provide: TranslateService, useClass: MockedTranslateService },
      ],
    });
    authService = TestBed.inject(SafeAuthService);
    snackbarService = TestBed.inject(SnackbarService);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    guard = new AccessGuard(
      authService,
      snackbarService,
      router,
      translateService
    );
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
