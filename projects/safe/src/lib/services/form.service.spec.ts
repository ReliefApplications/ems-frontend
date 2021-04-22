import { TestBed } from '@angular/core/testing';

import { SafeFormService } from './form.service';

describe('SafeFormService', () => {
  let service: SafeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
