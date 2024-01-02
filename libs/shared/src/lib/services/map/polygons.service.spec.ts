import { TestBed } from '@angular/core/testing';

import { PolygonsService } from './polygons.service';

describe('PolygonsService', () => {
  let service: PolygonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
