import { TestBed } from '@angular/core/testing';

import { SafeApplicationNotificationsService } from './application-notifications.service';

describe('SafeApplicationNotificationsService', () => {
  let service: SafeApplicationNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeApplicationNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
