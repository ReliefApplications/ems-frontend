import { TestBed } from '@angular/core/testing';

import { DatatemplateService } from './datatemplate.service';

describe('DatatemplateService', () => {
  let service: DatatemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatatemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
