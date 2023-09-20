import { TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
import { MockedRouter } from '../__mocks__/mock-class.test';
import { CanDeactivateGuard } from './can-deactivate.guard';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;
  //   let router!: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [
      //   // For future deep tests
      //   RouterTestingModule.withRoutes([
      //     { path: 'auth', component: TestingComponent },
      //   ]),
      // ],
      providers: [{ provide: Router, useClass: MockedRouter }],
    });
    // router = TestBed.inject(Router);
    guard = new CanDeactivateGuard();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
