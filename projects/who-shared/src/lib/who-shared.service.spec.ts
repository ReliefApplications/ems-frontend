import { TestBed } from '@angular/core/testing';

import { WhoSharedService } from './who-shared.service';

describe('WhoSharedService', () => {
  let service: WhoSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhoSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
