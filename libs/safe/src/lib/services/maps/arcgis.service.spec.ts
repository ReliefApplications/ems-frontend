import { TestBed } from '@angular/core/testing';

import { SafeArcgisService } from './arcgis.service';

describe('SafeArcgisService', () => {
  let service: SafeArcgisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeArcgisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
