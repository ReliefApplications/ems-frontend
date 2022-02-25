import { TestBed } from '@angular/core/testing';

import { SafeSnackBarService } from './snackbar.service';

describe('SafeSnackBarService', () => {
  let service: SafeSnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeSnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
