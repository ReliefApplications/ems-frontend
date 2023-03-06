import { TestBed } from '@angular/core/testing';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

import { SafeSnackBarService } from './snackbar.service';

describe('SafeSnackBarService', () => {
  let service: SafeSnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    });
    service = TestBed.inject(SafeSnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
