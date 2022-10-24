import { TestBed } from '@angular/core/testing';

import { SafeArcGISService } from './arc-gis.service';

describe('ArcGISService', () => {
  let service: SafeArcGISService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeArcGISService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
