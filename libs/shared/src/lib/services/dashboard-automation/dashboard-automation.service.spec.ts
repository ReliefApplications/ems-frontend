import { TestBed } from '@angular/core/testing';

import { DashboardAutomationService } from './dashboard-automation.service';

describe('DashboardAutomationService', () => {
  let service: DashboardAutomationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardAutomationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
