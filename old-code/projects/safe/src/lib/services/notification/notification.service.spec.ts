import { TestBed } from '@angular/core/testing';

import { SafeNotificationService } from './notification.service';

describe('SafeNotificationService', () => {
  let service: SafeNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
