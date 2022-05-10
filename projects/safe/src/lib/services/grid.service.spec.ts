import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { environment } from 'projects/back-office/src/environments/environment';

import { SafeGridService } from './grid.service';

describe('SafeGridService', () => {
  let service: SafeGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: 'environment', useValue: environment },
      ],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(SafeGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
