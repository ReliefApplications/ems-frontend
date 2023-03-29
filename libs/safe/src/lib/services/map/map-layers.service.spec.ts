import { TestBed } from '@angular/core/testing';

import { SafeMapLayersService } from './map-layers.service';

describe('MapLayersService', () => {
  let service: SafeMapLayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeMapLayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
