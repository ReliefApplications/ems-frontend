import { TestBed } from '@angular/core/testing';

import { MapPolygonsService } from './map-polygons.service';

describe('MapPolygonsService', () => {
  let service: MapPolygonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapPolygonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
