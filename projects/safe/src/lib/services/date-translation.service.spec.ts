import { TestBed } from '@angular/core/testing';

import { SafeDateTranslationService } from './date-translation.service';

describe('SafeDateTranslationService', () => {
  let service: SafeDateTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeDateTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
