import { TestBed } from '@angular/core/testing';

import { SafeApplicationUsersService } from './application-users.service';

describe('ApplicationUsersService', () => {
  let service: SafeApplicationUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeApplicationUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
