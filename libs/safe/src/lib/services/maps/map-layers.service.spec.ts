import { TestBed } from '@angular/core/testing';

import { MapLayersService } from './map-layers.service';

describe('MapLayersService', () => {
  let service: MapLayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
