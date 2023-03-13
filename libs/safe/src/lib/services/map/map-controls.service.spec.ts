import { TestBed } from '@angular/core/testing';

import { MapControlsService } from './map-controls.service';

describe('MapControlsService', () => {
  let service: MapControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
