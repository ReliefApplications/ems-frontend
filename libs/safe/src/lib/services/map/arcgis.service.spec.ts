import { TestBed } from '@angular/core/testing';

import { ArcgisService } from './arcgis.service';

describe('ArcgisService', () => {
  let service: ArcgisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArcgisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
