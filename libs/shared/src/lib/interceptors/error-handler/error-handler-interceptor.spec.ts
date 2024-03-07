import { TestBed } from '@angular/core/testing';

import { ErrorHandlerInterceptorService } from './error-handler-interceptor.service';

describe('ErrorHandlerInterceptorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ErrorHandlerInterceptorService],
    })
  );

  it('should be created', () => {
    const interceptor: ErrorHandlerInterceptorService = TestBed.inject(
      ErrorHandlerInterceptorService
    );
    expect(interceptor).toBeTruthy();
  });
});
