import { TestBed } from '@angular/core/testing';

import { AccessGuard } from './access.guard';
import { AuthService } from '@oort-front/shared';
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
  MockedAuthService,
  MockedSnackbarService,
  MockedTranslateService,
} from '../__mocks__/mock-class.test';

describe('AccessGuard', () => {
  let guard: AccessGuard;
  let router!: Router;
  let authService!: AuthService;
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
        { provide: AuthService, useClass: MockedAuthService },
        { provide: SnackbarService, useClass: MockedSnackbarService },
        { provide: Router, useClass: MockedRouter },
        { provide: TranslateService, useClass: MockedTranslateService },
      ],
    });
    authService = TestBed.inject(AuthService);
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
