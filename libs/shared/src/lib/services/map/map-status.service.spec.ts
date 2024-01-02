import { TestBed } from '@angular/core/testing';

import { MapStatusService } from './map-status.service';

describe('MapStatusService', () => {
  let service: MapStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
