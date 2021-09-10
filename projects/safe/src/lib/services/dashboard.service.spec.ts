import { TestBed } from '@angular/core/testing';

import { SafeDashboardService } from './dashboard.service';

describe('SafeDashboardService', () => {
  let service: SafeDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
