import { TestBed } from '@angular/core/testing';

import { WhoGridService } from './grid.service';

describe('WhoGridService', () => {
  let service: WhoGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhoGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
