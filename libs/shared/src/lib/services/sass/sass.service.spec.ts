import { TestBed } from '@angular/core/testing';

import { SassService } from './sass.service';

describe('SassService', () => {
  let service: SassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
