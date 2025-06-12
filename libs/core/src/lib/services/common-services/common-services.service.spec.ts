import { TestBed } from '@angular/core/testing';

import { CommonServicesService } from './common-services.service';

describe('CommonServicesService', () => {
  let service: CommonServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
