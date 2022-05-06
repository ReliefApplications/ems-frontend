import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
