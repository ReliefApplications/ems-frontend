import { TestBed } from '@angular/core/testing';

import { SafeDateTranslateService } from './date-translate.service';

describe('SafeDateTranslateService', () => {
  let service: SafeDateTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeDateTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
