import { TestBed } from '@angular/core/testing';

import { SafePreprocessorService } from './preprocessor.service';

describe('SafePreprocessorService', () => {
  let service: SafePreprocessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafePreprocessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
