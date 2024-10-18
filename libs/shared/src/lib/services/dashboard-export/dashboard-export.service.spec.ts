import { TestBed } from '@angular/core/testing';

import { DashboardExportService } from './dashboard-export.service';

describe('DashboardExportService', () => {
  let service: DashboardExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
