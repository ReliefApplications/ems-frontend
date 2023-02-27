import { TestBed } from '@angular/core/testing';

import { SafeFormBuilderService } from './form-builder.service';

describe('SafeFormBuilderService', () => {
  let service: SafeFormBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeFormBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
