import { TestBed } from '@angular/core/testing';

import { SafeMapService } from './map.service';

describe('MapService', () => {
  let service: SafeMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
