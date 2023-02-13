import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SafeGridLayoutService } from './grid-layout.service';

describe('SafeGridLayoutService', () => {
  let service: SafeGridLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    });
    service = TestBed.inject(SafeGridLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
